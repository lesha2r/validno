// Consts
import { ValidationDetails, ValidationIds } from "../../constants/details.js";
// Utils
import _validations from "../../utils/validations.js";
import _errors from "../../utils/errors.js";
import _validateType from "../../utils/validateType.js";
import isObjectId from "../../utils/isObjectId.js";
/**
 * Checks value against multiple possible types.
 * Called if requirements.type is an array (e.g. [String, Number]).
 */
const validateUnionType = (key, value, requirements, keyName = key) => {
    const typeList = Array.isArray(requirements.type)
        ? requirements.type.map((el) => String(el?.name || el))
        : [];
    const results = [];
    for (let i = 0; i < typeList.length; i++) {
        // @ts-ignore
        const requirementsRe = { ...requirements, type: requirements.type[i] };
        const result = handleTypeValidation(key, value, requirementsRe);
        results.push(result[0].passed);
        // If any type validation passes, return immediately
        if (results[i] === true)
            return _validateType.getResult(keyName, true);
    }
    const isPassed = results.some((r) => r === true);
    const result = _validateType.getResult(keyName, isPassed, isPassed ? undefined : _errors.getErrorDetails(keyName, typeList.join('/'), value));
    return result;
};
/**
 * Main type validation function.
 * Validates a value against a single type or multiple types defined in schema.
 */
const handleTypeValidation = (key, value, requirements, keyName = key) => {
    const reqs = { required: true, ...requirements };
    const isNotNull = value !== null;
    const keyTitle = 'title' in reqs && reqs.title !== undefined ? reqs.title : keyName;
    const hasCustomMessage = reqs.customMessage && typeof reqs.customMessage === 'function';
    if (value === undefined && reqs.required) {
        return [_validateType.getResult(keyName, false, _errors.getMissingError(keyName))];
    }
    // Handle case of multiple types like [String, Number]
    if (Array.isArray(reqs.type)) {
        return [validateUnionType(key, value, reqs)];
    }
    if (value === undefined && reqs.required === false) {
        return [_validateType.getResult(keyName, true)];
    }
    const customErrDetails = hasCustomMessage ?
        //@ts-ignore
        reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle,
            reqs: reqs,
            schema: {}
        }) :
        null;
    const baseErrDetails = _errors.getErrorDetails(keyName, reqs.type, value);
    const getDetails = (isOK, errorText) => isOK ?
        ValidationDetails.OK :
        errorText || customErrDetails || baseErrDetails;
    const typeBySchema = reqs.type;
    const result = [];
    switch (typeBySchema) {
        case 'any': {
            result.push(_validateType.getResult(keyName, true, getDetails(true)));
            break;
        }
        case Number: {
            const isNumber = isNotNull && value.constructor === Number;
            result.push(_validateType.getResult(keyName, isNumber, getDetails(isNumber)));
            break;
        }
        case String: {
            const isString = isNotNull && value.constructor === String;
            result.push(_validateType.getResult(keyName, isString, getDetails(isString)));
            break;
        }
        case Date: {
            const isDate = isNotNull && value.constructor === Date;
            const isValid = isDate && !isNaN(value.getTime());
            const isValidDate = isDate && isValid;
            result.push(_validateType.getResult(keyName, isValidDate, getDetails(isValidDate, ValidationDetails.INVALID_DATE)));
            break;
        }
        case Boolean: {
            const isBoolean = isNotNull && value.constructor === Boolean;
            result.push(_validateType.getResult(keyName, isBoolean, getDetails(isBoolean)));
            break;
        }
        case Array: {
            const isArray = isNotNull && value.constructor === Array;
            if (!isArray) {
                result.push(_validateType.getResult(keyName, false, getDetails(isArray)));
                break;
            }
            let isEachChecked = { passed: true, details: "" };
            if ('eachType' in reqs) {
                for (const el of value) {
                    const result = handleTypeValidation(`each of ${key}`, el, { type: reqs.eachType, required: true });
                    if (!result[0].passed) {
                        isEachChecked.passed = false;
                        isEachChecked.details = result[0].details || '';
                        break;
                    }
                }
            }
            const isOk = isArray && isEachChecked.passed;
            const details = !isEachChecked.passed ? isEachChecked.details : getDetails(isOk);
            result.push(_validateType.getResult(keyName, isOk, details));
            break;
        }
        case Object: {
            const isObject = _validations.isObject(value) && value.constructor === Object;
            result.push(_validateType.getResult(keyName, isObject, getDetails(isObject)));
            break;
        }
        case RegExp: {
            const isRegex = _validations.isRegex(value);
            result.push(_validateType.getResult(keyName, isRegex, getDetails(isRegex)));
            break;
        }
        case null: {
            const isNull = value === null;
            result.push(_validateType.getResult(keyName, isNull, getDetails(isNull)));
            break;
        }
        default: {
            const isInstanceOf = typeof typeBySchema === 'function' && value instanceof typeBySchema;
            const isConstructorSame = typeof typeBySchema === 'function' && value.constructor?.name === typeBySchema?.name;
            const isBothObjectId = isObjectId(value, typeBySchema);
            const isOK = (isInstanceOf && isConstructorSame) || (isBothObjectId);
            result.push(_validateType.getResult(keyName, isOK, getDetails(isOK)));
        }
    }
    return result;
};
function validateType(input) {
    const { results, key, value, reqs, nestedKey, typeChecked } = input;
    const typeCheck = handleTypeValidation(key, value, reqs, nestedKey);
    typeCheck.forEach((res) => {
        if (!res.passed) {
            typeChecked.push(false);
            results.errors.push(res.details || '');
        }
    });
}
export default validateType;
