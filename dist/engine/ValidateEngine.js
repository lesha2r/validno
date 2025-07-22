import ValidnoResult from "./ValidnoResult.js";
import validate from "./methods/validate.js";
import validateType from "./methods/validateType.js";
import validateRules from "./methods/validateRules.js";
import handleMissingKey from "./methods/handleMissingKey.js";
import handleNestedKey from "./methods/handleNestedKey.js";
import handleKey from "./methods/handleKey.js";
import handleMissingKeyValidation from "./methods/handleMissingKeyValidation.js";
import finishValidation from "./methods/finishValidation.js";
class ValidateEngine {
    constructor(definition) {
        this.definition = definition;
        this.result = new ValidnoResult();
    }
    validate(data, validationKeys) {
        return validate.call(this, data, validationKeys);
    }
    handleKey(input) {
        return handleKey.call(this, input);
    }
    handleNestedKey(input) {
        return handleNestedKey.call(this, input);
    }
    handleMissingKey(schema, input) {
        return handleMissingKey(schema, input);
    }
    handleMissingNestedKey(nestedKey, results) {
        results.setMissing(nestedKey);
        return results;
    }
    handleMissingKeyValidation(params) {
        return handleMissingKeyValidation.call(this, params);
    }
    validateType(input) {
        return validateType(input);
    }
    validateRules(input) {
        return validateRules.call(this, input);
    }
    finishValidation(checks) {
        return finishValidation(checks);
    }
}
export default ValidateEngine;
