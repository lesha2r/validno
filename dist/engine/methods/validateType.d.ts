import { SchemaDefinition } from "../../types/common.js";
import ValidnoResult from "../ValidnoResult.js";
export interface ValidateValueInput {
    results: ValidnoResult;
    key: string;
    value: any;
    reqs: SchemaDefinition;
    nestedKey: string;
    typeChecked: boolean[];
}
declare function validateType(input: ValidateValueInput): void;
export default validateType;
//# sourceMappingURL=validateType.d.ts.map