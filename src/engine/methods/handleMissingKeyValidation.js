function handleMissingKeyValidation(params) {
    const schema = this.definition;
    const { results, key, nestedKey, data, reqs, missedCheck } = params;
    // @ts-ignore
    const errMsg = this.handleMissingKey(schema, { key, nestedKey, data, reqs });
    missedCheck.push(false);
    results.setMissing(nestedKey, errMsg);
    return results;
}
export default handleMissingKeyValidation;
