const _validations = {};
_validations.isString = (value) => {
    return typeof value === 'string';
};
_validations.isNumber = (value) => {
    return typeof value === 'number';
};
_validations.isArray = (value) => {
    return Array.isArray(value);
};
_validations.isObject = (value) => {
    var _a;
    return value !== null && typeof value === 'object' && ((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Object' && !Array.isArray(value);
};
_validations.isDate = (value) => {
    return value instanceof Date && String(value) !== 'Invalid Date';
};
_validations.isRegex = (value) => {
    return value instanceof RegExp;
};
_validations.isBoolean = (value) => {
    return typeof value === 'boolean';
};
_validations.isNull = (value) => {
    return value === null;
};
_validations.isUndefined = (value) => {
    return value === undefined;
};
_validations.isNullOrUndefined = (value) => {
    return value === undefined || value === null;
};
_validations.isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};
_validations.isDateYYYYMMDD = (value) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(value);
};
_validations.isHex = (value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return regex.test(value);
};
_validations.lengthIs = (value, length) => {
    if (typeof value !== 'string' && !Array.isArray(value))
        return false;
    if (typeof length !== 'number')
        return false;
    return value.length === length;
};
_validations.lengthNot = (value, length) => {
    if (typeof value !== 'string' && !Array.isArray(value))
        return false;
    if (typeof length !== 'number')
        return false;
    return value.length !== length;
};
_validations.lengthMin = (value, min) => {
    if (typeof value !== 'string' && !Array.isArray(value))
        return false;
    if (typeof min !== 'number')
        return false;
    return value.length >= min;
};
_validations.lengthMax = (value, max) => {
    if (typeof value !== 'string' && !Array.isArray(value))
        return false;
    if (typeof max !== 'number')
        return false;
    return value.length <= max;
};
_validations.isNumberGte = (value, gte) => {
    return typeof value === 'number' && value >= gte;
};
_validations.isNumberLte = (value, lte) => {
    return typeof value === 'number' && value <= lte;
};
_validations.hasKey = (obj, key) => {
    if (_validations.isObject(obj) === false)
        return false;
    return key in obj;
};
const compareArrs = (v1, v2) => {
    if (v1.length !== v2.length)
        return false;
    return v1.every((el, i) => {
        if (_validations.isObject(el)) {
            return JSON.stringify(el) === JSON.stringify(v2[i]);
        }
        return v2[i] === el;
    });
};
_validations.is = (value, compareTo) => {
    if (value === compareTo) {
        return true;
    }
    const bothArrays = _validations.isArray(value) && _validations.isArray(compareTo);
    if (bothArrays) {
        return compareArrs(value, compareTo);
    }
    const bothObjects = _validations.isObject(value) && _validations.isObject(compareTo);
    if (bothObjects) {
        const valueStr = JSON.stringify(value);
        const compareToStr = JSON.stringify(compareTo);
        return valueStr === compareToStr;
    }
    const bothDates = _validations.isDate(value) && _validations.isDate(compareTo);
    if (bothDates) {
        return value.getTime() === compareTo.getTime();
    }
    return value === compareTo;
};
_validations.not = (value, not) => {
    return !_validations.is(value, not);
};
_validations.isNot = _validations.not;
_validations.ne = _validations.not;
_validations.regexTested = (value, regexp) => {
    if (!regexp || regexp instanceof RegExp !== true) {
        throw new Error('regexp argument is incorrect');
    }
    return regexp.test(value);
};
_validations.regex = _validations.regexTested;
_validations.regexp = _validations.regexTested;
_validations.test = _validations.regexTested;
export default _validations;
