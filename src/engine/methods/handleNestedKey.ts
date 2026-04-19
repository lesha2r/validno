import ValidateEngine, { KeyValidationDetails } from "../ValidateEngine.js";

function handleNestedKey(this: ValidateEngine, input: KeyValidationDetails) {
    const { results, key, nestedKey, data, reqs } = input;
  
    // Optimized: use for...in instead of Object.keys()
    const nestedResults: boolean[] = [];

    for (const itemKey in reqs) {
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