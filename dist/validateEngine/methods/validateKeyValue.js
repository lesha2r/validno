function validateKeyValue(params) {
    const { results, key, nestedKey, data, reqs, hasMissing } = params;
    const missedCheck = [];
    const typeChecked = [];
    const rulesChecked = [];
    if (hasMissing) {
        return this.handleMissingKeyValidation({ results, key, nestedKey, data, reqs, missedCheck });
    }
    this.checkValueType({ results, key, value: data[key], reqs, nestedKey, typeChecked });
    this.checkRulesForKey({ results, nestedKey, value: data[key], reqs, data, rulesChecked });
    return this.finalizeValidation({ results, nestedKey, missedCheck, typeChecked, rulesChecked });
}
export default validateKeyValue;
