import checkType from "./checkType.js";
import _errors from "./utils/errors.js";
import checkRules from "./checkRules.js";
import _helpers from "./utils/helpers.js";
import _validations from "./utils/validations.js";
import { ErrorKeywords } from "./constants/details.js";
import { Schema, TSchema, TSchemaInput } from "./Schema.js";
import ValidnoResult from "./ValidnoResult.js";

export interface IKeyHandler {
  results: ValidnoResult,
  key: string,
  data: any,
  reqs: TSchemaInput,
  nestedKey: string
}

function handleMissingKey(schema: TSchema, input: IKeyHandler) {
  const { key, nestedKey, data, reqs } = input;

  const messageKey = nestedKey || key;
  const messageTitle = reqs.title || messageKey;

  if (!reqs.customMessage) {
    return _errors.getMissingError(messageKey);
  }

  // @ts-ignore
  const errorMessage = reqs.customMessage({
    keyword: ErrorKeywords.Missing,
    value: data[key],
    key: messageKey,
    title: messageTitle,
    reqs,
    schema,
  });

  return errorMessage;
}

function validateNestedKey(this: any, input: IKeyHandler) {
  const { results, key, nestedKey, data, reqs } = input;

  const nestedKeys = Object.keys(reqs);
  const nestedResults: boolean[] = [];

  for (const itemKey of nestedKeys) {
    const deepParams: IKeyHandler = {
      key: itemKey,
      data: data[key],
      // @ts-ignore
      reqs: reqs[itemKey],
      nestedKey: `${nestedKey}.${itemKey}`
    }

    const deepResults = validateKey.call(this, deepParams)
    nestedResults.push(deepResults.ok!)
    results.merge(deepResults)
  }

  results.fixParentByChilds(nestedKey, nestedResults)

  return results
}

function validateKey(this: any, input: IKeyHandler) {
  let { results, key, nestedKey, data, reqs } = input;

  if (!results) results = new ValidnoResult();
  if (!nestedKey) nestedKey = key;

  const hasMissing = _helpers.hasMissing(input);

  if (_helpers.checkNestedIsMissing(reqs, data)) {
    return handleMissingNestedKey(results, nestedKey);
  }

  if (_helpers.checkIsNested(reqs)) {
    return validateNestedKey.call(this, { results, key, data, reqs, nestedKey });
  }

  // Validate key
  return validateKeyDetails.call(this, {
    results,
    key,
    nestedKey,
    data,
    reqs,
    hasMissing,
  });
}

function handleMissingNestedKey(results: ValidnoResult, nestedKey: string) {
  results.setMissing(nestedKey);
  return results;
}

function validateKeyDetails(this: any, params: {
  results: ValidnoResult;
  key: string;
  nestedKey: string;
  data: any;
  reqs: TSchemaInput;
  hasMissing: boolean;
}) {
  const { results, key, nestedKey, data, reqs, hasMissing } = params;

  const missedCheck: boolean[] = [];
  const typeChecked: boolean[] = [];
  const rulesChecked: boolean[] = [];

  if (hasMissing) {
    return handleMissingKeyValidation(this.schema, { results, key, nestedKey, data, reqs }, missedCheck);
  }

  checkValueType(results, key, data[key], reqs, nestedKey, typeChecked);
  checkRulesForKey.call(this, results, nestedKey, data[key], reqs, data, rulesChecked);
  return finalizeValidation(results, nestedKey, missedCheck, typeChecked, rulesChecked);
}

function handleMissingKeyValidation(
  schema: TSchema,
  params: { results: ValidnoResult; key: string; nestedKey: string; data: any; reqs: TSchemaInput },
  missedCheck: boolean[]
) {
  const { results, key, nestedKey, data, reqs } = params;
  // @ts-ignore
  const errMsg = handleMissingKey(schema, { key, nestedKey, data, reqs });
  missedCheck.push(false);
  results.setMissing(nestedKey, errMsg);
  return results;
}

function checkValueType(
  results: ValidnoResult,
  key: string,
  value: any,
  reqs: TSchemaInput,
  nestedKey: string,
  typeChecked: boolean[]
) {
  const typeCheck = checkType(key, value, reqs, nestedKey);
  typeCheck.forEach((res) => {
    if (!res.passed) {
      typeChecked.push(false);
      results.errors.push(res.details);
    }
  });
}

function checkRulesForKey(
  this: any,
  results: ValidnoResult,
  nestedKey: string,
  value: any,
  reqs: TSchemaInput,
  data: any,
  rulesChecked: boolean[]
) {
  // @ts-ignore
  const ruleCheck = checkRules.call(this, nestedKey, value, reqs, data);

  if (!ruleCheck.ok) {
    rulesChecked.push(false);
    ruleCheck.details.forEach((el) => {
      if (!(nestedKey in results.errorsByKeys)) results.errorsByKeys[nestedKey] = [];
      results.errors.push(el);
      results.errorsByKeys[nestedKey] = ['1'];
    });
  }
}

function finalizeValidation(
  results: ValidnoResult,
  nestedKey: string,
  missedCheck: boolean[],
  typeChecked: boolean[],
  rulesChecked: boolean[]
) {
  if (missedCheck.length) results.setMissing(nestedKey);

  const isPassed = !typeChecked.length && !rulesChecked.length && !missedCheck.length;

  if (!isPassed) {
    results.setFailed(nestedKey);
    results.errorsByKeys[nestedKey] = [...results.errors];
  } else {
    results.setPassed(nestedKey);
  }

  return results.finish();
}

function validateSchema(
  this: Schema,
  data: Record<string, unknown>,
  keysToCheck?: string | string[]
): ValidnoResult {
    const output = new ValidnoResult()
    const hasKeysToCheck = _helpers.areKeysLimited(keysToCheck)
    const schemaKeys = Object.entries(this.schema)

    for (const [key, reqs] of schemaKeys) {
      const toBeValidated = _helpers.needValidation(key, hasKeysToCheck, keysToCheck)
      if (!toBeValidated) continue
        
      const keyResult = validateKey.call(this, {key, data, reqs} as IKeyHandler)
      output.merge(keyResult)
    }
  
    output.finish()
    return output
};

export default validateSchema;