import { ErrorKeywords } from "./constants/details.js";
import _validations from "./utils/validations.js";
const getErrorDetails = (key, expectedType, receivedValue) => {
    let receivedType = '';
    if (typeof receivedValue === 'string')
        receivedType = 'String';
    else if (typeof receivedValue === 'number')
        receivedType = 'Number';
    else if (typeof receivedValue === 'boolean')
        receivedType = 'Noolean';
    else if (receivedValue === null)
        receivedType = 'null';
    else if (Array.isArray(receivedValue))
        receivedType = 'Array';
    else if (_validations.isDate(receivedValue))
        receivedType = 'Date';
    else if (_validations.isObject(receivedValue))
        receivedType = 'Object';
    else if (receivedValue === undefined)
        receivedType = 'undefined';
    return `Проверьте тип "${key}": ожидался ${(expectedType === null || expectedType === void 0 ? void 0 : expectedType.name) || expectedType}, получен ${receivedType || 'unknown'}`;
};
const checkTypeMultiple = (key, value, requirements, keyName = key) => {
    const constructorNames = requirements.type.map((el) => String((el === null || el === void 0 ? void 0 : el.name) || el));
    const result = {
        key: keyName,
        passed: false,
        details: getErrorDetails(keyName, constructorNames.join('/'), value)
    };
    let i = 0;
    while (i < requirements.type.length) {
        const requirementsRe = Object.assign(Object.assign({}, requirements), { type: requirements.type[i] });
        const check = checkType(key, value, requirementsRe);
        if (check[0].passed === true) {
            result.passed = true;
            result.details = 'OK';
            return result;
        }
        i++;
    }
    return result;
};
const checkType = (key, value, requirements, keyName = key) => {
    const isNotNull = value !== null;
    const keyTitle = 'title' in requirements ? requirements.title : keyName;
    const hasCustomMessage = requirements.customMessage && typeof requirements.customMessage === 'function';
    if (value === undefined && requirements.required) {
        return [{ key: keyName, passed: false, details: `Значение "${keyName}" отсутствует` }];
    }
    let result = [];
    if (Array.isArray(requirements.type)) {
        return [checkTypeMultiple(key, value, requirements)];
    }
    if (value === undefined && requirements.required !== true) {
        result.push({
            key: keyName,
            passed: true,
            details: 'OK'
        });
        return result;
    }
    const customErrDetails = hasCustomMessage ?
        requirements.customMessage({
            keyword: ErrorKeywords.Type,
            value: value,
            key: keyName,
            title: keyTitle,
            reqs: requirements,
            schema: null
        }) :
        null;
    const baseErrDetails = getErrorDetails(keyName, requirements.type, value);
    const getDetails = (isOK) => isOK ? 'OK' : customErrDetails || baseErrDetails;
    switch (requirements.type) {
        case 'any':
            result.push({
                key: keyName,
                passed: true,
                details: 'OK'
            });
            break;
        case Number:
            const isNumber = isNotNull && value.constructor === Number;
            result.push({
                key: keyName,
                passed: isNumber,
                details: getDetails(isNumber)
            });
            break;
        case String:
            const isString = isNotNull && value.constructor === String;
            result.push({
                key: keyName,
                passed: isString,
                details: getDetails(isString)
            });
            break;
        case Date:
            const isDate = isNotNull && value.constructor === Date;
            const isValid = isDate && !isNaN(value.getTime());
            const errorMsg = isValid ? getDetails(isDate) : 'Дата невалидна';
            result.push({
                key: keyName,
                passed: isDate && isValid,
                details: isDate && isValid ? 'OK' : errorMsg
            });
            break;
        case Boolean:
            const isBoolean = isNotNull && value.constructor === Boolean;
            result.push({
                key: keyName,
                passed: isBoolean,
                details: isBoolean ? 'OK' : getDetails(isBoolean)
            });
            break;
        case Array:
            const isArray = isNotNull && value.constructor === Array;
            if (!isArray) {
                result.push({
                    key: keyName,
                    passed: false,
                    details: getDetails(isArray)
                });
                break;
            }
            let isEachChecked = { passed: true, details: "" };
            if ('eachType' in requirements) {
                isEachChecked.passed = value.every((el) => {
                    const checkResult = checkType('each of ' + key, el, { type: requirements.eachType, required: true });
                    if (!checkResult[0].passed) {
                        isEachChecked.details = checkResult[0].details;
                        isEachChecked.passed = false;
                    }
                    return true;
                });
            }
            const isOk = isArray && isEachChecked.passed;
            result.push({
                key: keyName,
                passed: isOk,
                details: isOk ? 'OK' : !isEachChecked.passed ? isEachChecked.details : getDetails(isOk)
            });
            break;
        case Object:
            const isObject = _validations.isObject(value) && value.constructor === Object;
            result.push({
                key: keyName,
                passed: isObject,
                details: isObject ? 'OK' : getDetails(isObject)
            });
            break;
        case RegExp:
            const isRegex = _validations.isRegex(value);
            result.push({
                key: keyName,
                passed: isRegex,
                details: isRegex ? 'OK' : getDetails(isRegex)
            });
            break;
        case null:
            const isNull = value === null;
            result.push({
                key: keyName,
                passed: isNull,
                details: isNull ? 'OK' : getDetails(isNull)
            });
            break;
        default:
            result.push({
                key: keyName,
                passed: false,
                details: `Тип '${keyName}' не определен`
            });
    }
    return result;
};
export default checkType;
