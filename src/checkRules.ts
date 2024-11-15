import { TSchema, TSchemaItem } from "./Schema.js";
import _validations from "./utils/validations.js"

export type TRule = {[key: string]: any}

type TLengths = string | Array<any>

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

const rulesFunctions: any = {
    custom: (key: string, val: any, func: Function, extra: {schema: TSchema, input: {[key: string]: any}}) => {
        return func(val, extra)
    },
    isEmail: (key: string, val: any) => {
        return {
            result: _validations.isEmail(val),
            details: `Значение должно соответствовать формату name@email.ru`
        }
    },
    is: (key: string, val: any, equalTo: any) => {
        return {
            result: _validations.is(val, equalTo),
            details: `Значение должно быть "${equalTo}"`
        }
    },
    isNot: (key: string, val: any, notEqualTo: any) => {
        return {
            result: _validations.isNot(val, notEqualTo),
            details: `Значение "${notEqualTo}" недопустимо`
        }
    },
    min: (key: string, val: number, min: number) => {
        return {
            result: _validations.isNumberGte(val, min),
            details: "Значение не может быть меньше " + min
        }
    },
    max: (key: string, val: number, max: number) => {
        return {
            result: _validations.isNumberLte(val, max),
            details: "Значение не может быть больше " + max
        }
    },
    minMax: (key: string, val: number, minMax: [min: number, max: number]) => {
        const [min, max] = minMax
        return {
            result: _validations.isNumberGte(val, min) && _validations.isNumberLte(val, max),
            details: `Значение должно быть в пределах ${min}-${max}`
        }
    },
    length: (key: string, val: TLengths, length: number) => {
        return {
            result: _validations.lengthIs(val, length),
            details: "Количество символов должно быть равным " + length
        }
    },
    lengthNot: (key: string, val:  TLengths, lengthNot: number) => {
        return {
            result: _validations.lengthNot(val, lengthNot),
            details: "Количество символов не должно быть равным " + lengthNot
        }
    },
    lengthMinMax: (key: string, val:  TLengths, minMax: [min: number, max: number]) => {
        const [min, max] = minMax

        return {
            result: _validations.lengthMin(val, min) && _validations.lengthMax(val, max),
            details: `Длина должна быть от ${min} до ${max} символов`
        }
    },
    lengthMin: (key: string, val:  TLengths, min: number) => {
        ensureRuleHasCorrectType(val, rulesParams['lengthMin'].allowedTypes)

        return {
            result: _validations.lengthMin(val, min),
            details: `Длина не может быть меньше ${min} символов`
        }
    },
    lengthMax: (key: string, val:  TLengths, max: number) => {
        return {
            result: _validations.lengthMax(val, max),
            details: `Длина не может быть больше ${max} символов`
        }
    },
    regex: (key: string, val: any, regex: RegExp) => {
        return {
            result: _validations.regexTested(val, regex),
            details: "Значение не соответствует допустимому формату"
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
            output.details = isCorrect ? '' : `Значение "${value}" недопустимо`
        } else {
            const incorrectValues: any[] = []
            value.forEach((v: any) => !allowedList.includes(v) ? incorrectValues.push(v): {})
            const isCorrect = incorrectValues.length === 0

            output.result = isCorrect,
            output.details = isCorrect ? '' : `Значения недопустимы: "${incorrectValues.join(', ')}"`
        }

        return output
    }
};

type TRulesResult = {
    ok: boolean,
    details: string[]
} 

function checkRules (this: any, key: string, value: any, requirements: TSchemaItem, inputObj: any) {
    const result: TRulesResult = {
        ok: true,
        details: []
    };

    // Значение отсутствует, но НЕ является обязательным
    if (requirements.required !== true && value === undefined) return result

    // Для этого ключа нет правил
    if (!requirements || !requirements.rules || !Object.keys(requirements.rules).length) {
        return result
    }

    const rules: TRule = requirements.rules

    const allResults = []
    const allRulesKeys = Object.keys(rules)
    
    let i = 0;
    while (i < allRulesKeys.length) {
        const ruleName = allRulesKeys[i]

        // Если правило, указанное для ключа, отсутствует в списке доступных
        if (ruleName in rulesFunctions === false) {
            i++
            continue
        }

        const func = rulesFunctions[ruleName]
        const args = rules[ruleName]

        const result = func(key, value, args, {schema: this.schema, input: inputObj})
        allResults.push(result)

        i++;
    }
  
    // If key has failed rules checks
    const failedResults = allResults.filter(el => el.result === false)
    
    if (failedResults.length) {
        result.ok = false
        result.details = failedResults.map(el => el.details)
    }

    return result;
  };

  export default checkRules