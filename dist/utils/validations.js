const _validations = {};
_validations.isString = (value) => {
    return typeof value === 'string';
};
_validations.isDate = (value) => {
    return value instanceof Date && String(value) !== 'Invalid Date';
};
_validations.isNumber = (value) => {
    return typeof value === 'number';
};
_validations.isNumberGte = (value, gte) => {
    return typeof value === 'number' && value >= gte;
};
_validations.isNumberLte = (value, lte) => {
    return typeof value === 'number' && value <= lte;
};
_validations.isArray = (value) => {
    return Array.isArray(value);
};
_validations.isObject = (value) => {
    return typeof value === 'object' && !Array.isArray(value) && value !== null;
};
_validations.lengthIs = (value, length) => {
    return value.length === length;
};
_validations.lengthNot = (value, length) => {
    return value.length !== length;
};
_validations.lengthMin = (value, min) => {
    return value.length >= min;
};
_validations.lengthMax = (value, max) => {
    return value.length <= max;
};
_validations.isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};
_validations.isRegex = (value) => {
    return value instanceof RegExp;
};
_validations.hasKey = (obj, key) => {
    return key in obj;
};
_validations.isNot = (value, not) => {
    if (typeof not === 'object' && Array.isArray(not)) {
        for (let i = 0; i < not.length; i++) {
            if (value === not[i])
                return false;
        }
        return true;
    }
    return value !== not;
};
_validations.is = (value, compareTo) => {
    if (typeof compareTo === 'object' && Array.isArray(compareTo)) {
        for (let i = 0; i < compareTo.length; i++) {
            if (value === compareTo[i])
                return true;
        }
        return false;
    }
    return value === compareTo;
};
_validations.isDateYYYYMMDD = (value) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(value);
};
_validations.regexTested = (value, regex) => {
    if (!regex)
        throw new Error('regex argument is not defined');
    return regex.test(value);
};
_validations.isHex = (value) => {
    const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return regex.test(value);
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
export default _validations;
