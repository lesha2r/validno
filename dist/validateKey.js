import { getResultDefaults, handleReqKey, mergeResults } from "./validate.js";
const validateKey = (schema, data, key) => {
    if (key in schema.schema === false) {
        throw new Error(`Ключ ${key} отсутствует в схеме`);
    }
    let results = getResultDefaults();
    const keyResult = handleReqKey(key, data, schema.schema[key]);
    results = mergeResults(results, keyResult);
    if (results.failed.length)
        results.ok = false;
    else
        results.ok = true;
    return results;
};
export default validateKey;
