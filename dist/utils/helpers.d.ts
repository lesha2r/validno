import { KeyValidationDetails } from "../engine/ValidateEngine.js";
import { SchemaDefinition } from "../types/common.js";
interface HelperUtils {
    checkIsNested: (obj: Record<string, any>) => boolean;
    checkNestedIsMissing: (reqs: SchemaDefinition, data: any) => boolean;
    areKeysLimited: (onlyKeys: string[] | string) => boolean;
    needValidation: (key: string, hasLimits: boolean, onlyKeys?: string | string[]) => boolean;
    hasMissing: (input: KeyValidationDetails) => boolean;
    compareArrs: (v1: unknown[], v2: unknown[]) => boolean;
    compareObjs: (obj1: object, obj2: object) => boolean;
}
declare class HelperUtility implements HelperUtils {
    checkIsNested(obj: Record<string, any>): boolean;
    checkNestedIsMissing(reqs: SchemaDefinition, data: any): boolean;
    areKeysLimited(onlyKeys?: string[] | string): boolean;
    needValidation(key: string, hasLimits: boolean, onlyKeys?: string | string[]): boolean;
    hasMissing(input: KeyValidationDetails): boolean;
    compareArrs(v1: unknown[], v2: unknown[]): boolean;
    compareObjs(obj1: object, obj2: object): boolean;
    private deepEqual;
}
declare const helpers: HelperUtility;
export default helpers;
//# sourceMappingURL=helpers.d.ts.map