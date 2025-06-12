/**
 * Last refactored: 12.06.2025 (by @leshatour)  
 * 
 * 12.06.2025:
 * - Better TS typing
 * - Renamed checkType to validateType
 * - Renamed checkTypeMultiple to validateUnionType
 * - Extracted some logic to utils
 * - Extracted string value to constants
 * - Minimized code complexity
 * - Added more comments
 * - Added more types
 */

// CONSTS
import { EValidationDetails, EValidationId } from "./constants/details.js";

// UTILS
import _validations from "./utils/validations.js";
import _errors from "./utils/errors.js";
import _validateType, { TTypeValidationResult } from "./utils/validateType.js";

// TYPES
import { TSchemaInput, TSchemaItem } from "./Schema.js";

/**
 * Checks value against multiple possible types.
 * Called if requirements.type is an array (e.g. [String, Number]).
 */
const validateUnionType = (
  key: string,
  value: unknown,
  requirements: TSchemaItem,
  keyName = key
): TTypeValidationResult => {
  const typeList: string[] = Array.isArray(requirements.type)
    ? requirements.type.map((el: any) => String(el?.name || el))
    : [];

  const results = []

  for (let i = 0; i < typeList.length; i++) {
      // @ts-ignore
    const requirementsRe = { ...requirements, type: requirements.type[i] }
    const result = validateType(key, value, requirementsRe)
    results.push(result[0].passed)

    // If any type validation passes, return immediately
    if (results[i] === true) return _validateType.getResult(keyName, true)
  }

  const isPassed = results.some((r) => r === true)

  const result = _validateType.getResult(
    keyName,
    isPassed,
    isPassed ? null : _errors.getErrorDetails(keyName, typeList.join('/'), value)
  );

  return result
}

/**
 * Main type validation function.
 * Validates a value against a single type or multiple types defined in schema.
 */
const validateType = (key: string, value: unknown, requirements: TSchemaItem | TSchemaInput, keyName = key): TTypeValidationResult[] => {
  const isNotNull = value !== null
  const keyTitle = 'title' in requirements ? requirements.title : keyName
  const hasCustomMessage = requirements.customMessage && typeof requirements.customMessage === 'function'
  
  if (value === undefined && requirements.required) {
    return [_validateType.getResult(keyName, false, _errors.getMissingError(keyName))]
  }

  // Handle case of multiple types like [String, Number]
  if (Array.isArray(requirements.type)) {
    return [validateUnionType(key, value, requirements as TSchemaItem)]
  }

  if (value === undefined && requirements.required !== true) {
    return [_validateType.getResult(keyName, true)] 
  }
  
  const customErrDetails = hasCustomMessage ?
    //@ts-ignore
    requirements.customMessage({
      keyword: EValidationId.Type,
      value: value,
      key: keyName,
      title: keyTitle,
      reqs: requirements,
      schema: null
    }) :
    null;

  const baseErrDetails = _errors.getErrorDetails(keyName, requirements.type, value)

  const getDetails = (isOK: boolean, errorText?: string) => isOK ?
    EValidationDetails.OK :
    errorText || customErrDetails || baseErrDetails

  const typeBySchema = requirements.type
  const result: TTypeValidationResult[] = []

  switch (typeBySchema) {
    case 'any': {
      result.push(_validateType.getResult(keyName, true, getDetails(true)))
      break
    }
    case Number: {
      const isNumber = isNotNull && value!.constructor === Number
      result.push(_validateType.getResult(keyName, isNumber, getDetails(isNumber)))
      break
    }
    case String: {
      const isString = isNotNull && value!.constructor === String
      result.push(_validateType.getResult(keyName, isString, getDetails(isString)))
      break
    }
    case Date: {
      const isDate = isNotNull && value!.constructor === Date
      const isValid = isDate && !isNaN((value as Date).getTime())
      const isValidDate = isDate && isValid
      result.push(_validateType.getResult(keyName, isValidDate, getDetails(isValidDate, EValidationDetails.INVALID_DATE)))
      break
    }
    case Boolean: {
      const isBoolean = isNotNull && value!.constructor === Boolean
      result.push(_validateType.getResult(keyName, isBoolean, getDetails(isBoolean)))
      break
    }
    case Array: {
      const isArray = isNotNull && value!.constructor === Array
      if (!isArray) {
        result.push(_validateType.getResult(keyName, false, getDetails(isArray)))
        break
      }
      let isEachChecked = { passed: true, details: "" }
      if ('eachType' in requirements) {
        for (const el of value as any[]) {
          const result = validateType('each of ' + key, el, { type: requirements.eachType, required: true })
          if (!result[0].passed) {
            isEachChecked.passed = false
            isEachChecked.details = result[0].details || ''
            break
          }
        }
      }
      const isOk = isArray && isEachChecked.passed
      const details = !isEachChecked.passed ? isEachChecked.details : getDetails(isOk)
      result.push(_validateType.getResult(keyName, isOk, details))
      break
    }
    case Object: {
      const isObject = _validations.isObject(value) && value!.constructor === Object
      result.push(_validateType.getResult(keyName, isObject, getDetails(isObject)))
      break
    }
    case RegExp: {
      const isRegex = _validations.isRegex(value)
      result.push(_validateType.getResult(keyName, isRegex, getDetails(isRegex)))
      break
    }
    case null: {
      const isNull = value === null
      result.push(_validateType.getResult(keyName, isNull, getDetails(isNull)))
      break
    }
    default: {
      const isInstanceOf = typeof typeBySchema === 'function' && value instanceof typeBySchema
      const isConstructorSame = typeof typeBySchema === 'function' && value!.constructor?.name === typeBySchema?.name
      const isOK = isInstanceOf && isConstructorSame
      result.push(_validateType.getResult(keyName, isOK, getDetails(isOK)))
    }
  }

  return result;
};

export default validateType