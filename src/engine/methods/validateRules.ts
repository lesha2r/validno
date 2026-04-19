import { Schema } from "../../Schema.js";
import _validations from "../../utils/validations.js";
import ValidnoResult from "../ValidnoResult.js";
import { ValidationDetails } from "../../constants/details.js";

import { FieldSchema, SchemaDefinition, RuleWithMessage } from "../../types/common.js";

export interface ValidateRulesInput {
    results: ValidnoResult,
    nestedKey: string,
    value: any,
    reqs: SchemaDefinition,
    data: any,
    rulesChecked: boolean[]
}

export type Rule = Record<string, RuleWithMessage>

type TLengths = string | Array<any>

/**
 * Helper to extract rule value and optional inline message from rule definition.
 * Supports both simple values and objects with { value, message } format.
 */
function extractRuleValueAndMessage<T>(rule: RuleWithMessage<T>): { value: T; message?: string } {
    // Optimized: check for common case first (primitive value)
    if (rule === null || typeof rule !== 'object' || !('value' in rule)) {
        return { value: rule as T };
    }
    return { value: (rule as { value: T; message?: string }).value, message: (rule as { value: T; message?: string }).message };
}

export const rulesParams = {
    lengthMin: {
        allowedTypes: [String]
    }
}

const ensureRuleHasCorrectType = (value: any, allowedTypes: any[]) => {
    const isInAllowedList = allowedTypes.some(TYPE => {
        const getType = (el: any) => Object.prototype.toString.call(el)
        return getType(new TYPE()) == getType(value)
    })

    return isInAllowedList
}

interface CustomRuleExtras {
    schema: Schema,
    input: {[key: string]: any}
}

const rulesFunctions: any = {
    custom: (key: string, val: any, func: (value: unknown, extras: CustomRuleExtras) => {result: boolean, details: string}, extra: CustomRuleExtras) => {
        const customResult = func(val, extra)

        // Check if the result is an object with 'result' property
        if (typeof customResult === 'object' && 'result' in customResult) {
            return {
                result: customResult.result,
                details: customResult.details || ValidationDetails.CustomRuleFailed,
            }
        }

        // ... or check if the result is a boolean
        if (typeof customResult === 'boolean') {
            return {
                result: customResult,
                details: customResult ? "" : ValidationDetails.CustomRuleFailed
            }
        }

        // If the result is neither an object nor a boolean, throw an error
        throw new Error(`Custom rule function must return an object with 'result' and 'details' properties or a boolean value. Received: ${typeof customResult}`);

        return 
    },
    isEmail: (key: string, val: any) => {
        return {
            result: _validations.isEmail(val),
            details: `Value must be a valid email address`
        }
    },
    is: (key: string, val: any, equalTo: any) => {
        return {
            result: _validations.is(val, equalTo),
            details: `Value must be equal to "${equalTo}"`
        }
    },
    isNot: (key: string, val: any, notEqualTo: any) => {
        return {
            result: _validations.isNot(val, notEqualTo),
            details: `Value must not be equal to "${notEqualTo}"`
        }
    },
    min: (key: string, val: number, min: number) => {
        return {
            result: _validations.isNumberGte(val, min),
            details: `Value must be greater than or equal to ${min}`
        }
    },
    max: (key: string, val: number, max: number) => {
        return {
            result: _validations.isNumberLte(val, max),
            details: `Value must be less than or equal to ${max}`
        }
    },
    minMax: (key: string, val: number, minMax: [min: number, max: number]) => {
        const [min, max] = minMax
        return {
            result: _validations.isNumberGte(val, min) && _validations.isNumberLte(val, max),
            details: `Value must be between ${min} and ${max}`
        }
    },
    length: (key: string, val: TLengths, length: number) => {
        return {
            result: _validations.lengthIs(val, length),
            details: `Value length must be equal to ${length} ${Array.isArray(val) ? 'items' : 'characters'}`
        }
    },
    lengthNot: (key: string, val:  TLengths, lengthNot: number) => {
        return {
            result: _validations.lengthNot(val, lengthNot),
            details: `Value must not be equal to ${lengthNot} ${Array.isArray(val) ? 'items' : 'characters'}`
        }
    },
    lengthMinMax: (key: string, val:  TLengths, minMax: [min: number, max: number]) => {
        const [min, max] = minMax

        return {
            result: _validations.lengthMin(val, min) && _validations.lengthMax(val, max),
            details: `Value must be between ${min} and ${max} ${Array.isArray(val) ? 'items' : 'characters'}`
        }
    },
    lengthMin: (key: string, val:  TLengths, min: number) => {
        ensureRuleHasCorrectType(val, rulesParams['lengthMin'].allowedTypes)

        return {
            result: _validations.lengthMin(val, min),
            details: `Value must have at least ${min} ${Array.isArray(val) ? 'items' : 'characters'}`
        }
    },
    lengthMax: (key: string, val:  TLengths, max: number) => {
        ensureRuleHasCorrectType(val, rulesParams['lengthMin'].allowedTypes)

        return {
            result: _validations.lengthMax(val, max),
            details: `Value must not exceed ${max} ${Array.isArray(val) ? 'items' : 'characters'}`
        }
    },
    regex: (key: string, val: any, regex: RegExp) => {
        return {
            result: _validations.regexTested(val, regex),
            details: `Value must match the format ${regex}`
        }
    },
    enum: (key: string, value: any, allowedList: any[]) => {
        const output = {
            result: true,
            details: ''
        }

        if (!Array.isArray(value)) {
            const isCorrect = allowedList.includes(value)
            output.result = isCorrect,
            output.details = isCorrect ? '' : `Value "${value}" is not allowed`
        } else {
            const incorrectValues: any[] = []
            value.forEach((v: any) => !allowedList.includes(v) ? incorrectValues.push(v): {})
            const isCorrect = incorrectValues.length === 0

            output.result = isCorrect,
            output.details = isCorrect ? '' : `Values are not allowed: "${incorrectValues.join(', ')}"`
        }

        return output
    }
};

type RuleCheckResult = {
    ok: boolean,
    details: string[]
} 

function checkRules (this: any, key: string, value: any, requirements: FieldSchema, inputObj: any) {
    const result: RuleCheckResult = {
        ok: true,
        details: []
    };

    // Значение отсутствует, но НЕ является обязательным
    if (requirements.required !== true && value === undefined) return result

    // Для этого ключа нет правил
    if (!requirements || !requirements.rules || !Object.keys(requirements.rules).length) {
        return result
    }

    const rules: Rule = requirements.rules
    const title = requirements.title || key

    const allResults = []
    
    // Use for...in loop instead of Object.keys() for better performance
    for (const ruleName in rules) {
        // Если правило, указанное для ключа, отсутствует в списке доступных
        if (!(ruleName in rulesFunctions)) {
            continue
        }

        const func = rulesFunctions[ruleName];
        const rawArgs = rules[ruleName];
        
        // Extract value and optional inline message from rule definition
        const { value: args, message: inlineMessage } = extractRuleValueAndMessage(rawArgs);

        let result = func(key, value, args, { schema: this.schema, input: inputObj });
        
        // Priority: customMessage callback > inline message > default details
        if (requirements.customMessage && typeof requirements.customMessage === 'function') {
            result.details = requirements.customMessage({
                keyword: ruleName,
                value: value,
                key: key,
                title: title,
                reqs: requirements,
                schema: this.schema,
                rules: rules,
            })
        } else if (inlineMessage && !result.result) {
            // Use inline message only if validation failed
            result.details = inlineMessage;
        }

        allResults.push(result)
    }
  
    // If key has failed rules checks - optimize by avoiding filter
    let hasFailures = false;
    const failedDetails = [];
    for (let i = 0; i < allResults.length; i++) {
        if (allResults[i].result === false) {
            hasFailures = true;
            failedDetails.push(allResults[i].details);
        }
    }
    
    if (hasFailures) {
        result.ok = false
        result.details = failedDetails
    }

    return result;
};

function validateRules(input: ValidateRulesInput) {
    const { results, nestedKey, value, reqs, data, rulesChecked } = input;
    // @ts-ignore
    const ruleCheck = checkRules.call(this, nestedKey, value, reqs, data);

    if (!ruleCheck.ok) {
      rulesChecked.push(false);

      // Optimized: avoid forEach, use for loop
      const details = ruleCheck.details;
      
      // Ensure errorsByKeys entry exists
      if (!(nestedKey in results.errorsByKeys)) {
        results.errorsByKeys[nestedKey] = [];
      }
      
      for (let i = 0; i < details.length; i++) {
        results.errors.push(details[i]);
        results.errorsByKeys[nestedKey].push(details[i]);
      }
    }
}

export default validateRules;