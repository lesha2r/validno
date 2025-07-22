import _validations from "./validations.js";
import { defaultSchemaKeys } from "../Schema.js";
class HelperUtility {
    checkIsNested(obj) {
        if (!_validations.isObject(obj)) {
            return false;
        }
        const objKeys = Object.keys(obj);
        return !objKeys.every(key => defaultSchemaKeys.includes(key));
    }
    checkNestedIsMissing(reqs, data) {
        const isRequired = reqs.required;
        const isUndefined = data === undefined;
        const isEmpty = _validations.isObject(data) && Object.keys(data).length === 0;
        return isRequired && (isUndefined || isEmpty);
    }
    areKeysLimited(onlyKeys) {
        const hasArrayOfKeys = Array.isArray(onlyKeys) && onlyKeys.length > 0;
        const hasStringKey = typeof onlyKeys === 'string' && onlyKeys.length > 0;
        return hasArrayOfKeys || hasStringKey;
    }
    needValidation(key, hasLimits, onlyKeys) {
        if (!hasLimits) {
            return true;
        }
        return key === onlyKeys || (Array.isArray(onlyKeys) && onlyKeys.includes(key));
    }
    hasMissing(input) {
        const { reqs, data, key } = input;
        const isRequired = reqs.required === undefined || reqs.required === true;
        const missingData = (data === undefined || !(key in data) || data[key] === undefined);
        return isRequired && missingData;
    }
    compareArrs(v1, v2) {
        if (v1.length !== v2.length) {
            return false;
        }
        return v1.every((element, index) => {
            if (_validations.isObject(element)) {
                return JSON.stringify(element) === JSON.stringify(v2[index]);
            }
            return v2[index] === element;
        });
    }
    compareObjs(obj1, obj2) {
        return this.deepEqual(obj1, obj2);
    }
    deepEqual(value1, value2) {
        if (value1 === value2) {
            return true;
        }
        if (typeof value1 !== 'object' || value1 === null ||
            typeof value2 !== 'object' || value2 === null) {
            return false;
        }
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        return keys1.every(key => keys2.includes(key) && this.deepEqual(value1[key], value2[key]));
    }
}
const helpers = new HelperUtility();
export default helpers;
