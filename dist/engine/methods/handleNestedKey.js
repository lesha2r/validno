function handleNestedKey(input) {
    const { results, key, nestedKey, data, reqs } = input;
    const nestedKeys = Object.keys(reqs);
    const nestedResults = [];
    for (const itemKey of nestedKeys) {
        const deepParams = {
            key: itemKey,
            data: data[key],
            reqs: reqs[itemKey],
            nestedKey: `${nestedKey}.${itemKey}`
        };
        const deepResults = this.handleKey(deepParams);
        nestedResults.push(deepResults.ok);
        results.merge(deepResults);
    }
    results.fixParentByChilds(nestedKey, nestedResults);
    return results;
}
export default handleNestedKey;
