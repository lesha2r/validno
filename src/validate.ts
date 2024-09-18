import checkRules from "./checkRules.js";
import checkType from "./checkType.js";
import { defaultSchemaKeys, Schema, TSchemaInput } from "./Schema.js";
import _validations from "./utils/validations.js";

type TResult = {
    ok: null | boolean,
    missed: string[],
    failed: string[],
    passed: string[],
    errors: string[],
    byKeys: {[key: string]: boolean}
    errorsByKeys: {[key: string]: string[]}
};

const getResultDefaults = (): TResult => {
  return {
    ok: null,
    missed: [],
    failed: [],
    passed: [],
    errors: [],
    byKeys: {},
    errorsByKeys: {}
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

const mergeResults = (resultsOld: TResult, resultsNew: TResult) => {
  const output = getResultDefaults()

  output.failed = [...resultsOld.failed, ...resultsNew.failed]
  output.errors = [...resultsOld.errors, ...resultsNew.errors]
  output.missed = [...resultsOld.missed, ...resultsNew.missed]
  output.passed = [...resultsOld.passed, ...resultsNew.passed]
  output.byKeys = {...resultsOld.byKeys, ...resultsNew.byKeys}
  output.errorsByKeys = {...resultsOld.errorsByKeys, ...resultsNew.errorsByKeys}

  return output
}

const handleReqKey = (key: string, data: any, reqs: TSchemaInput, deepKey = key) => {
  let results = getResultDefaults()
  const hasNested = checkIsNested(reqs)
  
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

      const deepResults = handleReqKey(
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
  // @ts-ignore
  if (reqs.required === true && key in data === false || data === undefined) {
    missedCheck.push(false)
    results.errors.push(`Missing key '${deepKey}'`)
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
  const ruleCheck = checkRules(deepKey, data[key], reqs);

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

const validate = (schema: Schema, data: any): TResult => {
    let results: TResult = getResultDefaults()
  
    for (const [key, reqs] of Object.entries(schema.schema)) {
      // @ts-ignore
      const keyResult = handleReqKey(key, data, reqs)

      results = mergeResults(results, keyResult)
    }
  
    if (results.failed.length) results.ok = false
    else results.ok = true
    
    return results;
};

export default validate;