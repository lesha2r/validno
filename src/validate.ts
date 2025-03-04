import checkType from "./checkType.js";
import _errors from "./utils/errors.js";
import checkRules from "./checkRules.js";
import _helpers from "./utils/helpers.js";
import _validations from "./utils/validations.js";
import { ErrorKeywords } from "./constants/details.js";
import { Schema, TSchemaInput } from "./Schema.js";
import ValidnoResult, { TResult } from "./ValidnoResult.js";

export interface IKeyHandler {
  results: ValidnoResult,
  key: string,
  data: any,
  reqs: TSchemaInput,
  deepKey: string
}

function generateMsg(this: any, input: IKeyHandler) {
  let {results, key, deepKey, data, reqs} = input

  const keyForMsg = deepKey || key

  const keyTitle = 'title' in reqs ? reqs.title : keyForMsg
  
  if (reqs.customMessage && typeof reqs.customMessage === 'function') {
    // @ts-ignore
    const errMsg = reqs.customMessage({
      keyword: ErrorKeywords.Missing,
      value: data[key],
      key: keyForMsg,
      title: keyTitle,
      reqs: reqs,
      schema: this.schema
    })

    return errMsg
  }
  
  return _errors.getMissingError(keyForMsg)
}

function handleDeepKey(
  this: any,
  input: IKeyHandler
) {
  const {results, key, deepKey, data, reqs} = input

  const nesctedKeys: string[] = Object.keys(reqs)
  const nestedResults: boolean[] = []

  let i = 0;
  while (i < nesctedKeys.length) {
    const nestedKey: string = nesctedKeys[i]

    const deepParams: IKeyHandler = {
      key: nestedKey,
      data: data[key],
      // @ts-ignore
      reqs: reqs[nestedKey],
      deepKey: `${deepKey}.${nestedKey}`
    }

    const deepResults = handleKey.call(this, deepParams)
    nestedResults.push(deepResults.ok!)
    results.merge(deepResults)

    i++
  }

  results.fixParentByChilds(deepKey, nestedResults)

  return results
}

export function handleKey(
  this: any,
  input: IKeyHandler
) {
    let {results, key, deepKey, data, reqs} = input

    if (!results) results = new ValidnoResult()
    if (!deepKey) deepKey = key

    const hasNested = _helpers.checkIsNested(reqs)
    const hasMissing = _helpers.hasMissing(input)

    const missedCheck: boolean[] = [];
    const typeChecked: boolean[] = [];
    const rulesChecked: boolean[] = [];

    // If nested key is present but no data provided
    if (_helpers.checkNestedIsMissing(reqs, data)) {
      results.setMissing(deepKey)
      return results
    }

    // Handle nested keys first
    if (hasNested) {
      return handleDeepKey.call(this, {results, key, data, reqs, deepKey})
    }

    // Check missing keys
    if (hasMissing) {
      let errMsg = generateMsg.call(this, input)

      missedCheck.push(false)
      results.setMissing(deepKey, errMsg)

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
    if (missedCheck.length) results.setMissing(deepKey)
    
    const isPassed = (!typeChecked.length && !rulesChecked.length && !missedCheck.length)

    if (!isPassed) {
      results.setFailed(deepKey)

      results.errorsByKeys[deepKey] = [
        ...results.errors
      ]
    } else {
      results.setPassed(deepKey)
    }

    return results.finish()
}

function validate(
  schema: Schema,
  data: unknown,
  keysToCheck?: string | string[]
): ValidnoResult {
    const results = new ValidnoResult()
    const hasKeysToCheck = _helpers.areKeysLimited(keysToCheck)
    const schemaKeys = Object.entries(schema.schema)

    for (const [key, reqs] of schemaKeys) {
      const toBeValidated = _helpers.needValidation(key, hasKeysToCheck, keysToCheck)
      if (!toBeValidated) continue
        
      // @ts-ignore
      const keyResult = handleKey.call(this, {key, data, reqs})
      results.merge(keyResult)
    }
  
    results.finish()
    return results
};

export default validate;