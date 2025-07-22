import _helpers from "../utils/helpers.js";
function validate(data, validationKeys) {
    const hasKeysToCheck = _helpers.areKeysLimited(validationKeys);
    const schemaKeys = Object.entries(this.definition);
    for (const [key, reqs] of schemaKeys) {
        const toBeValidated = _helpers.needValidation(key, hasKeysToCheck, validationKeys);
        if (!toBeValidated)
            continue;
        const keyResult = this.validateKey({ key, data, reqs });
        this.result.merge(keyResult);
    }
    return this.result.finish();
}
export default validate;
