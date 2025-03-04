import { defaultSchemaKeys, TSchemaInput } from "../Schema.js"
import { IKeyHandler } from "../validate.js"
import ValidnoResult, { TResult } from "../ValidnoResult.js"
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

export default _helpers