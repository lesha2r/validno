export interface ResultInput {
    ok: null | boolean;
    missed: string[];
    failed: string[];
    passed: string[];
    errors: string[];
    byKeys: {
        [key: string]: boolean;
    };
    errorsByKeys: {
        [key: string]: string[];
    };
}
declare class ValidnoResult {
    ok: null | boolean;
    missed: string[];
    failed: string[];
    passed: string[];
    errors: string[];
    byKeys: {
        [key: string]: boolean;
    };
    errorsByKeys: {
        [key: string]: string[];
    };
    constructor(results?: ResultInput);
    setNoData(key: string): void;
    setKeyStatus(key: string, result: boolean): void;
    fixParentByChilds(parentKey: string, childChecks?: boolean[]): void;
    setMissing(key: string, errMsg?: string): void;
    setPassed(key: string): void;
    setFailed(key: string, msg?: string): void;
    joinErrors(separator?: string): string;
    merge(resultsNew: ResultInput): ValidnoResult;
    clearEmptyErrorsByKeys(): void;
    finish(): ValidnoResult;
    data(): ResultInput;
    isValid(): boolean;
}
export default ValidnoResult;
//# sourceMappingURL=ValidnoResult.d.ts.map