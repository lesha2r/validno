import { TSchemaInput, TSchemaItem } from "./Schema.js";
import _validations from "./utils/validations.js";

const getErrorDetails = (key: string, expectedType: any, receivedValue: any) => {
    let receivedType = ''

    if (typeof receivedValue === 'string') receivedType = 'String'
    else if (typeof receivedValue === 'number') receivedType = 'Number'
    else if (typeof receivedValue === 'boolean') receivedType = 'Noolean'
    else if (receivedValue === null) receivedType = 'null'
    else if (Array.isArray(receivedValue)) receivedType = 'Array'
    else if (_validations.isDate(receivedValue)) receivedType = 'Date'
    else if (_validations.isObject(receivedValue)) receivedType = 'Object'
    else if (receivedValue === undefined) receivedType = 'undefined'
    
    return `Проверьте тип "${key}": ожидался ${expectedType?.name || expectedType}, получен ${receivedType || 'unknown'}`;
};

const checkTypeMultiple = (key: string, value: any, requirements: TSchemaItem | TSchemaInput, keyName = key) => {
  const constructorNames = requirements.type.map((el:any) => String(el?.name || el))
  const result = {
    key: keyName,
    passed: false,
    details: getErrorDetails(keyName, constructorNames.join('/'), value)
  };

  let i = 0;
  while (i < requirements.type.length) {
    const requirementsRe = { ...requirements, type: requirements.type[i]}
    const check = checkType(key, value, requirementsRe)

    if (check[0].passed === true) {
      result.passed = true
      result.details = 'Passed'
      return result
    }

    i++
  }

  return result
}

type TCheckTypeResult = {key: string, passed: boolean, details: string}

const checkType = (key: string, value: any, requirements: TSchemaItem | TSchemaInput, keyName = key): TCheckTypeResult[] => {
    if (value === undefined && requirements.required) {
      return [{key: keyName, passed: false, details: `Key ${keyName} is missing`}]
    }

    let result: TCheckTypeResult[] = []

    if (Array.isArray(requirements.type)) {
      return [checkTypeMultiple(key, value, requirements)]
    }

    if (value === undefined && requirements.required !== true) {
      result.push({
        key: keyName,
        passed: true,
        details: 'Passed'
      })
      return result
    }
  
    switch (requirements.type) {
      case 'any':
        result.push({
          key: keyName,
          passed: true,
          details: 'Passed'
        })
        break;
      case Number:
        const isNumber = _validations.isNumber(value)
        result.push({
          key: keyName,
          passed: isNumber,
          details: isNumber ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })

        break;
      case String:
        const isString = _validations.isString(value);
        result.push({
          key: keyName,
          passed: isString,
          details: isString ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })
        break;
      case Date:
        const isDate = _validations.isDate(value)
        result.push({
          key: keyName,
          passed: isDate,
          details: isDate ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })
        break;
      case Boolean:
        const isBoolean = _validations.isBoolean(value);
        result.push({
          key: keyName,
          passed: isBoolean,
          details: isBoolean ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })
        break;
      case Array:
        const isArray = _validations.isArray(value);

        let isEachChecked = { passed: true, details: ""}
        
        if ('eachType' in requirements) {
          isEachChecked.passed = value.every((el: any) => {
            const checkResult = checkType('each of ' + key, el, {type: requirements.eachType, required: true})
            
            if (!checkResult[0].passed) {
              isEachChecked.details = checkResult[0].details
              isEachChecked.passed = false
            }

            return true
          })
        }

        const isOk = isArray && isEachChecked.passed

        result.push({
          key: keyName,
          passed: isOk,
          details: isOk ? 'Passed' : !isEachChecked.passed ? isEachChecked.details : getErrorDetails(keyName, requirements.type, value)
        })

        break;
      case Object:
        const isObject = _validations.isObject(value)
        result.push({
          key: keyName,
          passed: isObject,
          details: isObject ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })

        break;
      case RegExp:
        const isRegex = _validations.isRegex(value)
        result.push({
          key: keyName,
          passed: isRegex,
          details: isRegex ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })

        break;
      case null:
        const isNull = _validations.isNull(value);
        result.push({
          key: keyName,
          passed: isNull,
          details: isNull ? 'Passed' : getErrorDetails(keyName, requirements.type, value)
        })

        break;
      default:
        result.push({
          key: keyName,
          passed: false,
          details: `No type specified for key: '${keyName}'`
        })
    }
  
    return result;
};

  export default checkType