import { ErrorKeywords } from "./constants/details.js";
import { TSchemaInput, TSchemaItem } from "./Schema.js";
import _validations from "./utils/validations.js";
import _errors from "./utils/errors.js";


const checkTypeMultiple = (key: string, value: any, requirements: TSchemaItem | TSchemaInput, keyName = key) => {
  const constructorNames = requirements.type.map((el:any) => String(el?.name || el))
  
  const result = {
    key: keyName,
    passed: false,
    details: _errors.getErrorDetails(keyName, constructorNames.join('/'), value)
  };

  let i = 0;
  while (i < requirements.type.length) {
    const requirementsRe = { ...requirements, type: requirements.type[i]}
    const check = checkType(key, value, requirementsRe)

    if (check[0].passed === true) {
      result.passed = true
      result.details = 'OK'
      return result
    }

    i++
  }

  return result
}

type TCheckTypeResult = {key: string, passed: boolean, details: string}

const checkType = (key: string, value: any, requirements: TSchemaItem | TSchemaInput, keyName = key): TCheckTypeResult[] => {
    const isNotNull = value !== null
    const keyTitle = 'title' in requirements ? requirements.title : keyName
    const hasCustomMessage = requirements.customMessage && typeof requirements.customMessage === 'function'
    
    if (value === undefined && requirements.required) {
      return [{key: keyName, passed: false, details: `Значение "${keyName}" отсутствует`}]
    }

    let result: TCheckTypeResult[] = []

    if (Array.isArray(requirements.type)) {
      return [checkTypeMultiple(key, value, requirements)]
    }

    if (value === undefined && requirements.required !== true) {
      result.push({
        key: keyName,
        passed: true,
        details: 'OK'
      })
      return result
    }

    
    const customErrDetails = hasCustomMessage ?
      //@ts-ignore
      requirements.customMessage({
        keyword: ErrorKeywords.Type,
        value: value,
        key: keyName,
        title: keyTitle,
        reqs: requirements,
        schema: null
      }) :
      null;

    const baseErrDetails = _errors.getErrorDetails(keyName, requirements.type, value)
  
    const getDetails = (isOK: boolean) => isOK ? 'OK' : customErrDetails || baseErrDetails

      const typeBySchema = requirements.type

    switch (typeBySchema) {
      case 'any':
        result.push({
          key: keyName,
          passed: true,
          details: 'OK'
        })
        break;
      case Number:
        const isNumber = isNotNull && value.constructor === Number 

        result.push({
          key: keyName,
          passed: isNumber,
          details: getDetails(isNumber)
        })

        break;
      case String:
        const isString = isNotNull && value.constructor === String

        result.push({
          key: keyName,
          passed: isString,
          details: getDetails(isString)
        })
        break;
      case Date:
        const isDate = isNotNull && value.constructor === Date
        const isValid = isDate && !isNaN(value.getTime())
        const errorMsg = isValid ? getDetails(isDate) : 'Дата невалидна'

        result.push({
          key: keyName,
          passed: isDate && isValid,
          details: isDate && isValid ? 'OK' : errorMsg
        })
        break;
      case Boolean:
        const isBoolean = isNotNull && value.constructor === Boolean

        result.push({
          key: keyName,
          passed: isBoolean,
          details: isBoolean ? 'OK' : getDetails(isBoolean)
        })
        break;
      case Array:
        const isArray = isNotNull && value.constructor === Array

        if (!isArray) {
          result.push({
              key: keyName,
              passed: false,
              details: getDetails(isArray)
          });
          
          break;
      }

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
          details: isOk ? 'OK' : !isEachChecked.passed ? isEachChecked.details : getDetails(isOk)
        })

        break;
      case Object:
        const isObject = _validations.isObject(value) && value.constructor === Object

        result.push({
          key: keyName,
          passed: isObject,
          details: isObject ? 'OK' : getDetails(isObject)
        })

        break;
      case RegExp:
        const isRegex = _validations.isRegex(value)
        result.push({
          key: keyName,
          passed: isRegex,
          details: isRegex ? 'OK' : getDetails(isRegex)
        })

        break;
      case null:
        const isNull = value === null

        result.push({
          key: keyName,
          passed: isNull,
          details: isNull ? 'OK' : getDetails(isNull)
        })

        break;
      default:
        const isInstanceOf = value instanceof typeBySchema
        const isConstructorSame = value.constructor.name === typeBySchema.name
        const checked = isInstanceOf && isConstructorSame

        result.push({
          key: keyName,
          passed: checked,
          details: getDetails(checked)
        })
    }
  
    return result;
};

  export default checkType