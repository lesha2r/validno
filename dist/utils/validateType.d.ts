export interface TypeValidationResult {
    key: string;
    passed: boolean;
    details?: string;
}
interface TypeValidationUtils {
    getResult: (key: string, passed: boolean, details?: string) => TypeValidationResult;
}
declare class TypeValidationUtility implements TypeValidationUtils {
    getResult(key: string, passed: boolean, details?: string): TypeValidationResult;
}
declare const validateType: TypeValidationUtility;
export default validateType;
//# sourceMappingURL=validateType.d.ts.map