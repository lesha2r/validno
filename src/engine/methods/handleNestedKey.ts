import ValidateEngine, { KeyValidationDetails } from "../ValidateEngine.js";

function handleNestedKey(this: ValidateEngine, input: KeyValidationDetails) {
    const { results, key, nestedKey, data, reqs } = input;
  
    const nestedKeys = Object.keys(reqs);
    const nestedResults: boolean[] = [];

    for (const itemKey of nestedKeys) {
      const deepParams: KeyValidationDetails = {
        key: itemKey,
        data: data ? data[key] : undefined,
        // @ts-ignore
        reqs: reqs[itemKey],
        nestedKey: `${nestedKey}.${itemKey}`
      }

      const deepResults = this.handleKey(deepParams)

      nestedResults.push(deepResults.ok!)
      results.merge(deepResults)
    }

    results.fixParentByChilds(nestedKey, nestedResults)
    results.finish()

    return results
}

export default handleNestedKey;