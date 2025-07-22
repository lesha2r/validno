import _helpers from "./helpers.js";
class ValidationUtility {
    isString(value) {
        return typeof value === 'string';
    }
    isNumber(value) {
        return typeof value === 'number';
    }
    isArray(value) {
        return Array.isArray(value);
    }
    isObject(value) {
        var _a;
        return value !== null &&
            typeof value === 'object' &&
            ((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) === 'Object' &&
            !Array.isArray(value);
    }
    isDate(value) {
        return value instanceof Date && String(value) !== 'Invalid Date';
    }
    isRegex(value) {
        return value instanceof RegExp;
    }
    isBoolean(value) {
        return typeof value === 'boolean';
    }
    isNull(value) {
        return value === null;
    }
    isUndefined(value) {
        return value === undefined;
    }
    isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
    isEmail(value) {
        const emailRegex = /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    isDateYYYYMMDD(value) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(value);
    }
    isHex(value) {
        const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
        return regex.test(value);
    }
    lengthIs(value, length) {
        if (typeof value !== 'string' && !Array.isArray(value))
            return false;
        if (typeof length !== 'number')
            return false;
        return value.length === length;
    }
    lengthNot(value, length) {
        if (typeof value !== 'string' && !Array.isArray(value))
            return false;
        if (typeof length !== 'number')
            return false;
        return value.length !== length;
    }
    lengthMin(value, min) {
        if (typeof value !== 'string' && !Array.isArray(value))
            return false;
        if (typeof min !== 'number')
            return false;
        return value.length >= min;
    }
    lengthMax(value, max) {
        if (typeof value !== 'string' && !Array.isArray(value))
            return false;
        if (typeof max !== 'number')
            return false;
        return value.length <= max;
    }
    isNumberGte(value, gte) {
        return typeof value === 'number' && value >= gte;
    }
    isNumberGt(value, gt) {
        return typeof value === 'number' && value > gt;
    }
    isNumberLte(value, lte) {
        return typeof value === 'number' && value <= lte;
    }
    isNumberLt(value, lt) {
        return typeof value === 'number' && value < lt;
    }
    isDateGte(date1, date2) {
        if (!this.isDate(date1) || !this.isDate(date2)) {
            return false;
        }
        return date1 >= date2;
    }
    isDateGt(date1, date2) {
        if (!this.isDate(date1) || !this.isDate(date2)) {
            return false;
        }
        return date1 > date2;
    }
    isDateLte(date1, date2) {
        if (!this.isDate(date1) || !this.isDate(date2)) {
            return false;
        }
        return date1 <= date2;
    }
    isDateLt(date1, date2) {
        if (!this.isDate(date1) || !this.isDate(date2)) {
            return false;
        }
        return date1 < date2;
    }
    hasKey(obj, key) {
        if (!this.isObject(obj))
            return false;
        return key in obj;
    }
    is(value, compareTo) {
        if (value === compareTo) {
            return true;
        }
        const bothArrays = this.isArray(value) && this.isArray(compareTo);
        if (bothArrays) {
            return _helpers.compareArrs(value, compareTo);
        }
        const bothObjects = this.isObject(value) && this.isObject(compareTo);
        if (bothObjects) {
            return _helpers.compareObjs(value, compareTo);
        }
        const bothDates = this.isDate(value) && this.isDate(compareTo);
        if (bothDates) {
            return value.getTime() === compareTo.getTime();
        }
        return value === compareTo;
    }
    not(value, not) {
        return !this.is(value, not);
    }
    regexTested(value, regexp) {
        if (!regexp || !(regexp instanceof RegExp)) {
            throw new Error('regexp argument is incorrect');
        }
        return regexp.test(value);
    }
    get gt() { return this.isNumberGt; }
    get gte() { return this.isNumberGte; }
    get lte() { return this.isNumberLte; }
    get lt() { return this.isNumberLt; }
    get eq() { return this.is; }
    get isNot() { return this.not; }
    get ne() { return this.not; }
    get neq() { return this.not; }
    get regex() { return this.regexTested; }
    get regexp() { return this.regexTested; }
    get test() { return this.regexTested; }
}
const validations = new ValidationUtility();
export default validations;
