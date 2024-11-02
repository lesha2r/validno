import { Schema } from "./Schema.js";
import { getResultDefaults, handleReqKey, mergeResults, TResult } from "./validate.js";

const validateKey = (schema: Schema, data: any, key: string): TResult => {
    if (key in schema.schema === false) {
      throw new Error(`Ключ ${key} отсутствует в схеме`)
    }

    let results: TResult = getResultDefaults()
    //@ts-ignore
    const keyResult = handleReqKey(key, data, schema.schema[key])

    results = mergeResults(results, keyResult)

    if (results.failed.length) results.ok = false
    else results.ok = true
    
    return results;
};

export default validateKey;