import _validations from "./utils/validations.js";
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
    custom: (key, val, func) => {
        return func(val);
    },
    isEmail: (key, val) => {
        return {
            result: _validations.isEmail(val),
            details: `Значение должно соответствовать формату name@email.ru`
        };
    },
    is: (key, val, equalTo) => {
        return {
            result: _validations.is(val, equalTo),
            details: `Значение должно быть "${equalTo}"`
        };
    },
    isNot: (key, val, notEqualTo) => {
        return {
            result: _validations.isNot(val, notEqualTo),
            details: `Значение не должно быть "${notEqualTo}"`
        };
    },
    min: (key, val, min) => {
        return {
            result: _validations.isNumberGte(val, min),
            details: "Значение не может быть меньше " + min
        };
    },
    max: (key, val, max) => {
        return {
            result: _validations.isNumberLte(val, max),
            details: "Значение не может быть больше " + max
        };
    },
    minMax: (key, val, minMax) => {
        const [min, max] = minMax;
        return {
            result: _validations.isNumberGte(val, min) && _validations.isNumberLte(val, max),
            details: `Значение должно быть в пределах ${min}-${max}`
        };
    },
    length: (key, val, length) => {
        return {
            result: _validations.lengthIs(val, length),
            details: "Количество символов должно быть равным " + length
        };
    },
    lengthNot: (key, val, lengthNot) => {
        return {
            result: _validations.lengthNot(val, lengthNot),
            details: "Количество символов не должно быть равным " + lengthNot
        };
    },
    lengthMinMax: (key, val, minMax) => {
        const [min, max] = minMax;
        return {
            result: _validations.lengthMin(val, min) && _validations.lengthMin(val, max),
            details: `Длина должна быть от ${min} до ${max} символов`
        };
    },
    lengthMin: (key, val, min) => {
        ensureRuleHasCorrectType(val, rulesParams['lengthMin'].allowedTypes);
        return {
            result: _validations.lengthMin(val, min),
            details: `Длина не может быть меньше ${min} символов`
        };
    },
    lengthMax: (key, val, max) => {
        return {
            result: _validations.lengthMax(val, max),
            details: `Длина не может быть больше ${max} символов`
        };
    },
    regex: (key, val, regex) => {
        return {
            result: _validations.regexTested(val, regex),
            details: "Значение не соответствует допустимому формату"
        };
    },
    enum: (key, value, allowedList) => {
        return {
            result: allowedList.includes(value),
            details: `Значение "${value}" не допустимо`
        };
    }
};
const checkRules = (key, value, requirements) => {
    const result = {
        ok: true,
        details: []
    };
    if (requirements.required !== true && value === undefined)
        return result;
    if ('rules' in requirements === false)
        return result;
    if (!requirements || !requirements.rules || !Object.keys(requirements.rules).length) {
        return result;
    }
    const rules = requirements.rules;
    const allResults = [];
    const allRules = Object.keys(rules);
    let i = 0;
    while (i < allRules.length) {
        const ruleName = allRules[i];
        if (ruleName in rulesFunctions === false) {
            i++;
            continue;
        }
        const func = rulesFunctions[ruleName];
        const args = rules[ruleName];
        const result = func(key, value, args);
        allResults.push(result);
        i++;
    }
    const failedResults = allResults.filter(el => el.result === false);
    if (failedResults.length) {
        result.ok = false;
        result.details = failedResults.map(el => el.details);
    }
    return result;
};
export default checkRules;
