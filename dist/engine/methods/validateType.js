import { ValidationDetails, ValidationIds } from "../../constants/details.js";
import _validations from "../../utils/validations.js";
import _errors from "../../utils/errors.js";
import _validateType from "../../utils/validateType.js";
const validateUnionType = (key, value, requirements, keyName = key) => {
    const typeList = Array.isArray(requirements.type)
        ? requirements.type.map((el) => String((el === null || el === void 0 ? void 0 : el.name) || el))
        : [];
    const results = [];
    for (let i = 0; i < typeList.length; i++) {
        const requirementsRe = Object.assign(Object.assign({}, requirements), { type: requirements.type[i] });
        const result = handleTypeValidation(key, value, requirementsRe);
        results.push(result[0].passed);
        if (results[i] === true)
            return _validateType.getResult(keyName, true);
    }
    const isPassed = results.some((r) => r === true);
    const result = _validateType.getResult(keyName, isPassed, isPassed ? undefined : _errors.getErrorDetails(keyName, typeList.join('/'), value));
    return result;
};
const handleTypeValidation = (key, value, requirements, keyName = key) => {
    var _a;
    const isNotNull = value !== null;
    const keyTitle = 'title' in requirements ? requirements.title : keyName;
    const hasCustomMessage = requirements.customMessage && typeof requirements.customMessage === 'function';
    if (value === undefined && requirements.required) {
        return [_validateType.getResult(keyName, false, _errors.getMissingError(keyName))];
    }
    if (Array.isArray(requirements.type)) {
        return [validateUnionType(key, value, requirements)];
    }
    if (value === undefined && requirements.required !== true) {
        return [_validateType.getResult(keyName, true)];
    }
    const customErrDetails = hasCustomMessage ?
        requirements.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle,
            reqs: requirements,
            schema: null
        }) :
        null;
    const baseErrDetails = _errors.getErrorDetails(keyName, requirements.type, value);
    const getDetails = (isOK, errorText) => isOK ?
        ValidationDetails.OK :
        errorText || customErrDetails || baseErrDetails;
    const typeBySchema = requirements.type;
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
            if ('eachType' in requirements) {
                for (const el of value) {
                    const result = handleTypeValidation(`each of ${key}`, el, { type: requirements.eachType, required: true });
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
            const isConstructorSame = typeof typeBySchema === 'function' && ((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.name) === (typeBySchema === null || typeBySchema === void 0 ? void 0 : typeBySchema.name);
            const isOK = isInstanceOf && isConstructorSame;
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
