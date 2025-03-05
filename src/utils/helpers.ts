import { defaultSchemaKeys, TSchemaInput } from "../Schema.js"
import { IKeyHandler } from "../validate.js"
import _validations from "./validations.js"

const _helpers: {[key: string]: Function} = {}

_helpers.checkIsNested = (obj: {[key: string]: any}) => {
  if (!_validations.isObject(obj)) return false

  const objKeys = Object.keys(obj)

  if (objKeys.every((k: any) => defaultSchemaKeys.includes(k))) {
    return false
  } else {
    return true
  }
}

_helpers.checkNestedIsMissing = (reqs: TSchemaInput, data: any) => {
  const isRequired = reqs.required
  const isUndef = data === undefined
  const isEmpty = _validations.isObject(data) && !Object.keys(data).length
  
  return isRequired && (isUndef || isEmpty)
}

_helpers.areKeysLimited = (onlyKeys: string[] | string) => {
  const hasArrayOfKeys = (Array.isArray(onlyKeys) && onlyKeys.length > 0)
  const hasStringKey = (typeof onlyKeys === 'string' && onlyKeys.length > 0)

  return hasArrayOfKeys || hasStringKey
}

_helpers.needValidation = (
  key: string,
  hasLimits: boolean,
  onlyKeys?: string | string[]
) => {
  const noLimits = !hasLimits
  const keyIsInList = (key === onlyKeys || Array.isArray(onlyKeys) && onlyKeys?.includes(key))

  return noLimits || keyIsInList
}

_helpers.hasMissing = (input: IKeyHandler) => {
  const {reqs, data, key} = input;

  // @ts-ignore
  const isRequired = reqs.required === true
  const missingData = (data === undefined || key in data === false || data[key] === undefined)

  return isRequired && missingData
}

_helpers.compareArrs = (v1: unknown[], v2: unknown[]) => {
  if (v1.length !== v2.length) return false;
  return v1.every((el: unknown, i: number) => {
      if (_validations.isObject(el)) {
          return JSON.stringify(el) === JSON.stringify(v2[i])
      }

      return v2[i] === el
  })
}

_helpers.compareObjs = (obj1: object, obj2: object) => {
  function deepEqual(obj1: any, obj2: any) {
    if (obj1 === obj2) {
      return true;
    }
  
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
      return false;
    }
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
  
    return true;
  }

  return deepEqual(obj1, obj2)
}
export default _helpers