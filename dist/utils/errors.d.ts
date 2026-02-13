interface ErrorUtils {
    getMissingError: (key?: string) => string;
    getErrorDetails: (key: string, expectedType: any, receivedValue: any) => string;
    joinErrors: (errorsArr: string[], separator?: string) => string;
}
declare class ErrorUtility implements ErrorUtils {
    getMissingError(key?: string): string;
    getErrorDetails(key: string, expectedType: any, receivedValue: any): string;
    joinErrors(errorsArr: string[], separator?: string): string;
    private getTypeString;
    private getExpectedTypeString;
}
declare const errors: ErrorUtility;
export default errors;
//# sourceMappingURL=errors.d.ts.map