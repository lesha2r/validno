import { SchemaDefinition, FieldSchema } from "../../types/common.js";
import ValidnoResult from "../ValidnoResult.js";

// Consts
import { ValidationDetails, ValidationIds } from "../../constants/details.js";

// Utils
import _validations from "../../utils/validations.js";
import _errors from "../../utils/errors.js";
import _validateType, { TypeValidationResult } from "../../utils/validateType.js";
import isObjectId from "../../utils/isObjectId.js";

/**
 * Checks value against multiple possible types.
 * Called if requirements.type is an array (e.g. [String, Number]).
 */
const validateUnionType = (
  key: string,
  value: unknown,
  requirements: FieldSchema,
  keyName = key
): TypeValidationResult => {
  const typeList: string[] = Array.isArray(requirements.type)
    ? requirements.type.map((el: any) => String(el?.name || el))
    : [];

  const results = []

  for (let i = 0; i < typeList.length; i++) {
      // @ts-ignore
    const requirementsRe = { ...requirements, type: requirements.type[i] }
    const result = handleTypeValidation(key, value, requirementsRe)
    results.push(result[0].passed)

    // If any type validation passes, return immediately
    if (results[i] === true) return _validateType.getResult(keyName, true)
  }

  const isPassed = results.some((r) => r === true)

  const result = _validateType.getResult(
    keyName,
    isPassed,
    isPassed ? undefined : _errors.getErrorDetails(keyName, typeList.join('/'), value)
  );

  return result
}

/**
 * Main type validation function.
 * Validates a value against a single type or multiple types defined in schema.
 */
const handleTypeValidation = (
  key: string,
  value: unknown,
  requirements: FieldSchema | SchemaDefinition,
  keyName = key
): TypeValidationResult[] => {
  // Optimized: avoid object spread, set required property directly if missing
  const reqs = requirements as FieldSchema;
  if (reqs.required === undefined) {
    reqs.required = true;
  }

  const keyTitle = 'title' in reqs && reqs.title !== undefined ? reqs.title : keyName
  const hasCustomMessage = reqs.customMessage && typeof reqs.customMessage === 'function'

  if (value === undefined && reqs.required) {
    return [_validateType.getResult(keyName, false, _errors.getMissingError(keyName))]
  }

  // Handle case of multiple types like [String, Number]
  if (Array.isArray(reqs.type)) {
    return [validateUnionType(key, value, reqs as FieldSchema)]
  }

  if (value === undefined && reqs.required === false) {
    return [_validateType.getResult(keyName, true)] 
  }
  
  // Optimized: only generate error messages when needed (on failure)
  const typeBySchema = reqs.type
  const result: TypeValidationResult[] = []

  switch (typeBySchema) {
    case 'any': {
      result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      break
    }
    case Number: {
      // Check for both primitive and wrapped numbers
      const isNumber = typeof value === 'number' || (value !== null && value !== undefined && value.constructor === Number)
      if (isNumber) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    case String: {
      // Check for both primitive and wrapped strings
      const isString = typeof value === 'string' || (value !== null && value !== undefined && value.constructor === String)
      if (isString) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    case Date: {
      // Optimized: inline date check
      const isDate = value !== null && value !== undefined && value.constructor === Date
      const isValid = isDate && !isNaN((value as Date).getTime())
      if (isValid) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          ValidationDetails.InvalidDate
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    case Boolean: {
      // Check for both primitive and wrapped booleans
      const isBoolean = typeof value === 'boolean' || (value !== null && value !== undefined && value.constructor === Boolean)
      if (isBoolean) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    case Array: {
      const isArray = Array.isArray(value)
      if (!isArray) {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
        break
      }
      let isEachChecked = { passed: true, details: "" }
      if ('eachType' in reqs) {
        // Optimized: use for loop instead of for...of
        const arr = value as any[];
        for (let i = 0; i < arr.length; i++) {
          const result = handleTypeValidation(`each of ${key}`, arr[i], { type: reqs.eachType, required: true })

          if (!result[0].passed) {
            isEachChecked.passed = false
            isEachChecked.details = result[0].details || ''
            break
          }
        }
      }
      if (isEachChecked.passed) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        result.push(_validateType.getResult(keyName, false, isEachChecked.details))
      }
      break
    }
    case Object: {
      // Optimized: inline object check (avoid function call)
      const isObject = value !== null && typeof value === 'object' && !Array.isArray(value) && value.constructor === Object
      if (isObject) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    case RegExp: {
      // Optimized: inline regex check
      const isRegex = value !== null && value !== undefined && value.constructor === RegExp
      if (isRegex) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    case null: {
      const isNull = value === null
      if (isNull) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
      break
    }
    default: {
      if (value === null && typeBySchema !== null) {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
        break
      }

      const isInstanceOf = typeof typeBySchema === 'function' && value instanceof typeBySchema
      const isConstructorSame = typeof typeBySchema === 'function' && value!.constructor?.name === typeBySchema?.name
      const isBothObjectId = isObjectId(value, typeBySchema)

      const isOK = (isInstanceOf && isConstructorSame) || (isBothObjectId);
      if (isOK) {
        result.push(_validateType.getResult(keyName, true, ValidationDetails.OK))
      } else {
        const details = hasCustomMessage ?
          //@ts-ignore
          reqs.customMessage({
            keyword: ValidationIds.Type,
            value: value,
            key: keyName,
            title: keyTitle as string,
            reqs: reqs,
            schema: {} as SchemaDefinition
          }) :
          _errors.getErrorDetails(keyName, reqs.type, value)
        result.push(_validateType.getResult(keyName, false, details))
      }
    }
  }

  return result;
};

export interface ValidateValueInput {
    results: ValidnoResult,
    key: string,
    value: any,
    reqs: SchemaDefinition,
    nestedKey: string,
    typeChecked: boolean[]
}

function validateType(input: ValidateValueInput) {
    const { results, key, value, reqs, nestedKey, typeChecked } = input;
    const typeCheck = handleTypeValidation(key, value, reqs, nestedKey);

    // Optimized: use for loop instead of forEach
    for (let i = 0; i < typeCheck.length; i++) {
      if (!typeCheck[i].passed) {
        typeChecked.push(false);
        const errMsg = typeCheck[i].details || '';
        results.errors.push(errMsg);
        
        // Also add to errorsByKeys for this specific key
        if (!(nestedKey in results.errorsByKeys)) {
          results.errorsByKeys[nestedKey] = [];
        }
        results.errorsByKeys[nestedKey].push(errMsg);
      }
    }
}

export default validateType;