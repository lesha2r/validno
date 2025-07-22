import { SchemaDefinition } from "../../types/common.js";
import ValidnoResult from "../ValidnoResult.js";
import ValidateEngine from "../ValidateEngine.js";

export interface HandleMissingKeyValidationParams {
    results: ValidnoResult;
    key: string;
    nestedKey: string;
    data: any;
    reqs: SchemaDefinition;
    missedCheck: boolean[];
}

function handleMissingKeyValidation(
    this: ValidateEngine,
    params: HandleMissingKeyValidationParams,
  ) {
    const schema = this.definition

    const { results, key, nestedKey, data, reqs, missedCheck } = params;
    // @ts-ignore
    const errMsg = this.handleMissingKey(schema, { key, nestedKey, data, reqs });
    missedCheck.push(false);
    results.setMissing(nestedKey, errMsg);
    return results;
}

export default handleMissingKeyValidation;