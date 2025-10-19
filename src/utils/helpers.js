import _validations from "./validations.js";
import { defaultSchemaKeys } from "../Schema.js";
class HelperUtility {
    /**
     * Checks if an object represents a nested schema definition
     * @param obj - Object to check for nested structure
     * @returns True if object is nested, false otherwise
     */
    checkIsNested(obj) {
        if (!_validations.isObject(obj)) {
            return false;
        }
        const objKeys = Object.keys(obj);
        return !objKeys.every(key => defaultSchemaKeys.includes(key));
    }
    /**
     * Checks if required nested data is missing
     * @param reqs - Schema definition requirements
     * @param data - Data to validate
     * @returns True if required nested data is missing
     */
    checkNestedIsMissing(reqs, data) {
        const isRequired = reqs.required;
        const isUndefined = data === undefined;
        const isEmpty = _validations.isObject(data) && Object.keys(data).length === 0;
        return isRequired && (isUndefined || isEmpty);
    }
    /**
     * Checks if validation should be limited to specific keys
     * @param onlyKeys - Keys to limit validation to
     * @returns True if keys are limited
     */
    areKeysLimited(onlyKeys) {
        const hasArrayOfKeys = Array.isArray(onlyKeys) && onlyKeys.length > 0;
        const hasStringKey = typeof onlyKeys === 'string' && onlyKeys.length > 0;
        return hasArrayOfKeys || hasStringKey;
    }
    /**
     * Determines if a key needs validation based on limitations
     * @param key - Key to check
     * @param hasLimits - Whether there are key limitations
     * @param onlyKeys - Limited keys list
     * @returns True if key needs validation
     */
    needValidation(key, hasLimits, onlyKeys) {
        if (!hasLimits) {
            return true;
        }
        return key === onlyKeys || (Array.isArray(onlyKeys) && onlyKeys.includes(key));
    }
    /**
     * Checks if required data is missing for a key
     * @param input - Key validation details
     * @returns True if required data is missing
     */
    hasMissing(input) {
        const { reqs, data, key } = input;
        // @ts-ignore
        const isRequired = reqs.required === undefined || reqs.required === true;
        const missingData = (data === undefined || !(key in data) || data[key] === undefined);
        return isRequired && missingData;
    }
    /**
     * Compares two arrays for deep equality
     * @param v1 - First array to compare
     * @param v2 - Second array to compare
     * @returns True if arrays are deeply equal
     */
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
    /**
     * Compares two objects for deep equality
     * @param obj1 - First object to compare
     * @param obj2 - Second object to compare
     * @returns True if objects are deeply equal
     */
    compareObjs(obj1, obj2) {
        return this.deepEqual(obj1, obj2);
    }
    /**
     * Performs deep equality comparison between two values
     * @private
     * @param value1 - First value to compare
     * @param value2 - Second value to compare
     * @returns True if values are deeply equal
     */
    deepEqual(value1, value2) {
        // Same reference or primitive values
        if (value1 === value2) {
            return true;
        }
        // Check if both are objects and not null
        if (typeof value1 !== 'object' || value1 === null ||
            typeof value2 !== 'object' || value2 === null) {
            return false;
        }
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        // Different number of keys
        if (keys1.length !== keys2.length) {
            return false;
        }
        // Recursively check each key
        return keys1.every(key => keys2.includes(key) && this.deepEqual(value1[key], value2[key]));
    }
}
const helpers = new HelperUtility();
export default helpers;
