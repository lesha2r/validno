import _helpers from "../../utils/helpers.js";
import ValidnoResult from "../ValidnoResult.js";
import { SchemaDefinition } from "../../types/common.js";
import ValidateEngine, { KeyValidationDetails } from "../ValidateEngine.js";

export interface ValidateKeyDetailsParams {
    results: ValidnoResult;
    key: string;
    nestedKey: string;
    data: any;
    reqs: SchemaDefinition;
    hasMissing: boolean;
}

function validateKeyValue(this: ValidateEngine, params: ValidateKeyDetailsParams) {
    const { results, key, nestedKey, data, reqs, hasMissing } = params;

    // Reuse arrays to reduce allocations
    const checks = {
      missedCheck: [] as boolean[],
      typeChecked: [] as boolean[],
      rulesChecked: [] as boolean[]
    };

    if (hasMissing) {
      return this.handleMissingKeyValidation({ results, key, nestedKey, data, reqs, missedCheck: checks.missedCheck });
    }

    const keyValue = data ? data[key] : undefined;

    this.validateType({results, key, value: keyValue, reqs, nestedKey, typeChecked: checks.typeChecked});
    this.validateRules({results, nestedKey, value:  keyValue, reqs, data, rulesChecked: checks.rulesChecked});

    return this.finishValidation({results, nestedKey, missedCheck: checks.missedCheck, typeChecked: checks.typeChecked, rulesChecked: checks.rulesChecked});
}

function validateKey(this: ValidateEngine, input: KeyValidationDetails): ValidnoResult {
    let { results, key, nestedKey = key, data, reqs } = input;

    if (data === undefined) {
      const noDataResult = new ValidnoResult()
      noDataResult.setNoData(nestedKey)
    }

    if (!results) results = new ValidnoResult();

    const hasMissing = _helpers.hasMissing(input);

    if (_helpers.checkNestedIsMissing(reqs, data)) {
      return this.handleMissingNestedKey(nestedKey, results);
    }

    if (_helpers.checkIsNested(reqs)) {
      return this.handleNestedKey({ results, key, data, reqs, nestedKey });
    }

    return validateKeyValue.call(this, {
      results,
      key,
      nestedKey,
      data,
      reqs,
      hasMissing,
    });
}

export default validateKey;
