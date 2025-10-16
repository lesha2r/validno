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
declare function handleMissingKeyValidation(this: ValidateEngine, params: HandleMissingKeyValidationParams): ValidnoResult;
export default handleMissingKeyValidation;
//# sourceMappingURL=handleMissingKeyValidation.d.ts.map