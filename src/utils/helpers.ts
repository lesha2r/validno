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

_helpers.mergeResults = (resultsOld: TResult, resultsNew: TResult) => {
  const output = new ValidnoResult()

  output.failed = [...resultsOld.failed, ...resultsNew.failed]
  output.errors = [...resultsOld.errors, ...resultsNew.errors]
  output.missed = [...resultsOld.missed, ...resultsNew.missed]
  output.passed = [...resultsOld.passed, ...resultsNew.passed]
  output.byKeys = {...resultsOld.byKeys, ...resultsNew.byKeys}
  output.errorsByKeys = {...resultsOld.errorsByKeys, ...resultsNew.errorsByKeys}

  return output
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

export default _helpers