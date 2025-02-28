import checkType from "./checkType.js";
import _errors from "./utils/errors.js";
import checkRules from "./checkRules.js";
import _validations from "./utils/validations.js";
import { ErrorKeywords } from "./constants/details.js";
import { defaultSchemaKeys, Schema, TSchemaInput } from "./Schema.js";

export type TResult = {
    ok: null | boolean,
    missed: string[],
    failed: string[],
    passed: string[],
    errors: string[],
    byKeys: {[key: string]: boolean},
    errorsByKeys: {[key: string]: string[]},
};

export const getResultDefaults = (): TResult => {
  return {
    ok: null,
    missed: [],
    failed: [],
    passed: [],
    errors: [],
    byKeys: {},
    errorsByKeys: {},
  };
}

const checkIsNested = (obj: {[key: string]: any}) => {
  if (!_validations.isObject(obj)) return false

  const objKeys = Object.keys(obj)

  if (objKeys.every((k: any) => defaultSchemaKeys.includes(k))) {
    return false
  } else {
    return true
  }
}

export const mergeResults = (resultsOld: TResult, resultsNew: TResult) => {
  const output = getResultDefaults()

  output.failed = [...resultsOld.failed, ...resultsNew.failed]
  output.errors = [...resultsOld.errors, ...resultsNew.errors]
  output.missed = [...resultsOld.missed, ...resultsNew.missed]
  output.passed = [...resultsOld.passed, ...resultsNew.passed]
  output.byKeys = {...resultsOld.byKeys, ...resultsNew.byKeys}
  output.errorsByKeys = {...resultsOld.errorsByKeys, ...resultsNew.errorsByKeys}

  return output
}

export function handleReqKey(this: any, key: string, data: any, reqs: TSchemaInput, deepKey = key) {
  let results = getResultDefaults()
  const hasNested = checkIsNested(reqs)
  const keyTitle = 'title' in reqs ? reqs.title : deepKey

  const missedCheck: boolean[] = [];
  const typeChecked: boolean[] = [];
  const rulesChecked: boolean[] = [];

  // If nested key is present but no data provided
  // @ts-ignore
  if (reqs.required && (
    data === undefined || 
    (_validations.isObject(data) && !Object.keys(data).length))
  ) {
    results.missed.push(deepKey)
    results.failed.push(deepKey)
    results.byKeys[deepKey] = false

    return results
  }

  // Handle nested keys first
  if (hasNested) {
    const nestedReqKeys: string[] = Object.keys(reqs)
    results.byKeys[deepKey] = true

    let i = 0;
    while (i < nestedReqKeys.length) {
      const reqKeyI: string = nestedReqKeys[i]

      const deepResults = handleReqKey.call(
        this,
        reqKeyI,
        data[key],
        // @ts-ignore
        reqs[reqKeyI],
        deepKey + '.' + reqKeyI
      )

      results = mergeResults(results, deepResults)

      i++
    }

    return results
  }

  // Check missing keys

  if (
    // @ts-ignore
    reqs.required === true &&
    (key in data === false || data === undefined || data[key] === undefined)
  ) {
    console.log(data)
    let errMsg = _errors.getMissingError(deepKey)
    
    if (reqs.customMessage && typeof reqs.customMessage === 'function') {
      // @ts-ignore
      errMsg = reqs.customMessage({
        keyword: ErrorKeywords.Missing,
        value: data[key],
        key: deepKey,
        title: keyTitle,
        reqs: reqs,
        schema: this.schema
      })
    }

    missedCheck.push(false)
    results.missed.push(deepKey)
    results.failed.push(deepKey)
    results.errors.push(errMsg)
    if (deepKey in results.errorsByKeys === false) results.errorsByKeys[deepKey] = []
    results.errorsByKeys[deepKey].push(errMsg)
    results.byKeys[deepKey] = false

    return results
  }

  // Check value type
  const typeCheck = checkType(key, data[key], reqs, deepKey);
  
  typeCheck.forEach(res => {
    if (res.passed === false) {
      typeChecked.push(res.passed)
      results.errors.push(res.details)
    }
  })

  // Check all rules
  // @ts-ignore
  const ruleCheck = checkRules.call(this, deepKey, data[key], reqs, data);

  if (!ruleCheck.ok) {
    rulesChecked.push(false)
    ruleCheck.details.forEach((el) => {
      if (deepKey in results.errorsByKeys) results.errorsByKeys[deepKey] = []

      results.errors.push(el)
      results.errorsByKeys[deepKey] = ['1']
    })
  }

  // Combine final result
  if (missedCheck.length) results.missed.push(deepKey)

  if (typeChecked.length || rulesChecked.length) {
    results.failed.push(deepKey)
  } else {
    results.passed.push(deepKey)
  }

  results.errorsByKeys[deepKey] = [
    ...results.errors
  ]

  results.byKeys[deepKey] = (
    missedCheck.length + typeChecked.length + rulesChecked.length
  ) === 0

  return results
}

const checkIfValidationIsNeeded = (key: string, hasLimits: boolean, onlyKeys?: string | string[]) => {
  return !hasLimits || (key === onlyKeys || Array.isArray(onlyKeys) && onlyKeys?.includes(key))
}

function validate(schema: Schema, data: any, onlyKeys?: string | string[]): TResult {
    let results: TResult = getResultDefaults()
    const areKeysLimited = (Array.isArray(onlyKeys) && onlyKeys.length > 0) || (typeof onlyKeys === 'string' && onlyKeys.length > 0)

    for (const [key, reqs] of Object.entries(schema.schema)) {
      const isValidationRequired = checkIfValidationIsNeeded(key, areKeysLimited, onlyKeys)
      
      if (isValidationRequired) {
        // @ts-ignore
        const keyResult = handleReqKey.call(this, key, data, reqs)

        results = mergeResults(results, keyResult)
      }
    }
  
    if (results.failed.length) results.ok = false
    else results.ok = true

    return new ValidnoResult(results);
};

interface ValidnoResult extends TResult { }
class ValidnoResult {
  constructor(results: TResult) {
    this.ok = results.ok
    this.missed = results.missed
    this.failed = results.failed
    this.passed = results.passed
    this.errors = results.errors
    this.byKeys = results.byKeys
    this.errorsByKeys = results.errorsByKeys
    this.byKeys = results.byKeys
  }

  joinErrors(separator = '; ') {
    return _errors.joinErrors(this.errors, separator)
  }
}

export default validate;