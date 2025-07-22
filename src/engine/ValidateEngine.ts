import { Schema } from "../Schema.js";
import ValidnoResult from "./ValidnoResult.js";
import { SchemaDefinition } from "../types/common.js";

import _errors from "../utils/errors.js";
import _helpers from "../utils/helpers.js";
import _validations from "../utils/validations.js";

// Methods
import validate from "./methods/validate.js";
import validateType, { ValidateValueInput } from "./methods/validateType.js";
import validateRules, {ValidateRulesInput} from "./methods/validateRules.js";
import handleMissingKey from "./methods/handleMissingKey.js";
import handleNestedKey from "./methods/handleNestedKey.js";
import handleKey from "./methods/handleKey.js";
import handleMissingKeyValidation, { HandleMissingKeyValidationParams } from "./methods/handleMissingKeyValidation.js";
import finishValidation, { FinalizeValidationInput } from "./methods/finishValidation.js";

export interface KeyValidationDetails {
  results: ValidnoResult,
  key: string,
  data: any,
  reqs: SchemaDefinition,
  nestedKey: string
}

class ValidateEngine {
  definition: SchemaDefinition;
  result: ValidnoResult;

constructor(definition: SchemaDefinition) {
    this.definition = definition
    this.result = new ValidnoResult();
  }

  validate(data: any, validationKeys?: string | string[]): ValidnoResult {
    return validate.call(this, data, validationKeys);
  }

  handleKey(input: KeyValidationDetails) {
    return handleKey.call(this, input);
  }

  handleNestedKey(input: KeyValidationDetails) {
    return handleNestedKey.call(this, input);
  }

  handleMissingKey(schema: Schema, input: KeyValidationDetails) {
    return handleMissingKey(schema, input);
  }

  handleMissingNestedKey(nestedKey: string, results: ValidnoResult) {
    results.setMissing(nestedKey);
    return results;
  }

  handleMissingKeyValidation(params: HandleMissingKeyValidationParams) {
    return handleMissingKeyValidation.call(this, params);
  }

  validateType(input: ValidateValueInput) {
    return validateType(input);
  }

  validateRules(input: ValidateRulesInput) {
    return validateRules.call(this, input);
  }

  finishValidation(checks: FinalizeValidationInput) {
    return finishValidation(checks);
  }
}

export default ValidateEngine;