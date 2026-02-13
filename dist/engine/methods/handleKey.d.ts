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
declare function validateKey(this: ValidateEngine, input: KeyValidationDetails): ValidnoResult;
export default validateKey;
//# sourceMappingURL=handleKey.d.ts.map