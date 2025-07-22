import ValidnoResult from "../ValidnoResult.js";
import validate from "./methods/validate.js";
import handleMissingKey from "./methods/handleMissingKey.js";
import handleNestedKey from "./methods/handleNestedKey.js";
import handleKey from "./methods/handleKey.js";
import handleMissingKeyValidation from "./methods/handleMissingKeyValidation.js";
import checkRulesForKey from "./methods/checkRulesForKey.js";
import finishValidation from "./methods/finishValidation.js";
import validateType from "./methods/validateType.js";
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
    checkRulesForKey(input) {
        return checkRulesForKey.call(this, input);
    }
    finishValidation(checks) {
        return finishValidation(checks);
    }
}
export default ValidateEngine;
