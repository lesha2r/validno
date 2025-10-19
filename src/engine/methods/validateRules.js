import _validations from "../../utils/validations.js";
import { ValidationDetails } from "../../constants/details.js";
export const rulesParams = {
    lengthMin: {
        allowedTypes: [String]
    }
};
const ensureRuleHasCorrectType = (value, allowedTypes) => {
    const isInAllowedList = allowedTypes.some(TYPE => {
        const getType = (el) => Object.prototype.toString.call(el);
        return getType(new TYPE()) == getType(value);
    });
    return isInAllowedList;
};
const rulesFunctions = {
    custom: (key, val, func, extra) => {
        const customResult = func(val, extra);
        // Check if the result is an object with 'result' property
        if (typeof customResult === 'object' && 'result' in customResult) {
            return {
                result: customResult.result,
                details: customResult.details || ValidationDetails.CustomRuleFailed,
            };
        }
        // ... or check if the result is a boolean
        if (typeof customResult === 'boolean') {
            return {
                result: customResult,
                details: customResult ? "" : ValidationDetails.CustomRuleFailed
            };
        }
        // If the result is neither an object nor a boolean, throw an error
        throw new Error(`Custom rule function must return an object with 'result' and 'details' properties or a boolean value. Received: ${typeof customResult}`);
        return;
    },
    isEmail: (key, val) => {
        return {
            result: _validations.isEmail(val),
            details: `Value must be a valid email address`
        };
    },
    is: (key, val, equalTo) => {
        return {
            result: _validations.is(val, equalTo),
            details: `Value must be equal to "${equalTo}"`
        };
    },
    isNot: (key, val, notEqualTo) => {
        return {
            result: _validations.isNot(val, notEqualTo),
            details: `Value must not be equal to "${notEqualTo}"`
        };
    },
    min: (key, val, min) => {
        return {
            result: _validations.isNumberGte(val, min),
            details: `Value must be greater than or equal to ${min}`
        };
    },
    max: (key, val, max) => {
        return {
            result: _validations.isNumberLte(val, max),
            details: `Value must be less than or equal to ${max}`
        };
    },
    minMax: (key, val, minMax) => {
        const [min, max] = minMax;
        return {
            result: _validations.isNumberGte(val, min) && _validations.isNumberLte(val, max),
            details: `Value must be between ${min} and ${max}`
        };
    },
    length: (key, val, length) => {
        return {
            result: _validations.lengthIs(val, length),
            details: `Value must be equal to ${length}`
        };
    },
    lengthNot: (key, val, lengthNot) => {
        return {
            result: _validations.lengthNot(val, lengthNot),
            details: `Value must not be equal to ${lengthNot}`
        };
    },
    lengthMinMax: (key, val, minMax) => {
        const [min, max] = minMax;
        return {
            result: _validations.lengthMin(val, min) && _validations.lengthMax(val, max),
            details: `Value must be between ${min} and ${max} characters`
        };
    },
    lengthMin: (key, val, min) => {
        ensureRuleHasCorrectType(val, rulesParams['lengthMin'].allowedTypes);
        return {
            result: _validations.lengthMin(val, min),
            details: `Value must be at least ${min} characters`
        };
    },
    lengthMax: (key, val, max) => {
        return {
            result: _validations.lengthMax(val, max),
            details: `Value must not be exceed ${max} characters`
        };
    },
    regex: (key, val, regex) => {
        return {
            result: _validations.regexTested(val, regex),
            details: `Value must match the format ${regex}`
        };
    },
    enum: (key, value, allowedList) => {
        const output = {
            result: true,
            details: ''
        };
        if (!Array.isArray(value)) {
            const isCorrect = allowedList.includes(value);
            output.result = isCorrect,
                output.details = isCorrect ? '' : `Value "${value}" is not allowed`;
        }
        else {
            const incorrectValues = [];
            value.forEach((v) => !allowedList.includes(v) ? incorrectValues.push(v) : {});
            const isCorrect = incorrectValues.length === 0;
            output.result = isCorrect,
                output.details = isCorrect ? '' : `Values are not allowed: "${incorrectValues.join(', ')}"`;
        }
        return output;
    }
};
function checkRules(key, value, requirements, inputObj) {
    const result = {
        ok: true,
        details: []
    };
    // Значение отсутствует, но НЕ является обязательным
    if (requirements.required !== true && value === undefined)
        return result;
    // Для этого ключа нет правил
    if (!requirements || !requirements.rules || !Object.keys(requirements.rules).length) {
        return result;
    }
    const rules = requirements.rules;
    const title = requirements.title || key;
    const allResults = [];
    const allRulesKeys = Object.keys(rules);
    let i = 0;
    while (i < allRulesKeys.length) {
        const ruleName = allRulesKeys[i];
        // Если правило, указанное для ключа, отсутствует в списке доступных
        if (ruleName in rulesFunctions === false) {
            i++;
            continue;
        }
        const func = rulesFunctions[ruleName];
        const args = rules[ruleName];
        let result = func(key, value, args, { schema: this.schema, input: inputObj });
        if (requirements.customMessage && typeof requirements.customMessage === 'function') {
            result.details = requirements.customMessage({
                keyword: ruleName,
                value: value,
                key: key,
                title: title,
                reqs: requirements,
                schema: this.schema,
                rules: rules,
            });
        }
        allResults.push(result);
        i++;
    }
    // If key has failed rules checks
    const failedResults = allResults.filter(el => el.result === false);
    if (failedResults.length) {
        result.ok = false;
        result.details = failedResults.map(el => el.details);
    }
    return result;
}
;
function validateRules(input) {
    const { results, nestedKey, value, reqs, data, rulesChecked } = input;
    // @ts-ignore
    const ruleCheck = checkRules.call(this, nestedKey, value, reqs, data);
    if (!ruleCheck.ok) {
        rulesChecked.push(false);
        ruleCheck.details.forEach((el) => {
            if (!(nestedKey in results.errorsByKeys))
                results.errorsByKeys[nestedKey] = [];
            results.errors.push(el);
            results.errorsByKeys[nestedKey] = ['1'];
        });
    }
}
export default validateRules;
