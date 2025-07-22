import _errors from "../utils/errors.js";

export interface ResultInput {
  ok: null | boolean;
  missed: string[];
  failed: string[];
  passed: string[];
  errors: string[];
  byKeys: { [key: string]: boolean };
  errorsByKeys: { [key: string]: string[] };
}

class ValidnoResult {
  ok: null | boolean;
  missed: string[];
  failed: string[];
  passed: string[];
  errors: string[];
  byKeys: { [key: string]: boolean };
  errorsByKeys: { [key: string]: string[] };

  constructor(results?: ResultInput) {
    this.ok = results?.ok !== undefined ? results.ok : null;
    this.missed = results?.missed || [];
    this.failed = results?.failed || [];
    this.passed = results?.passed || [];
    this.errors = results?.errors || [];
    this.byKeys = results?.byKeys || {};
    this.errorsByKeys = results?.errorsByKeys || {};
  }

  setNoData(key: string): void {
    this.ok = false;
    this.errors = [`Missing value for '${key}'`];
  }

  setKeyStatus(key: string, result: boolean): void {
    this.byKeys[key] = result;
  }

  fixParentByChilds(parentKey: string, childChecks: boolean[] = []): void {
    const isEveryOk = childChecks.every(check => check === true);
    this.setKeyStatus(parentKey, isEveryOk);

    if (isEveryOk) {
        this.setPassed(parentKey);
    } else {
        this.setFailed(parentKey);
    }
  }

  setMissing(key: string, errMsg?: string): void {
    const error = errMsg || _errors.getMissingError(key);

    this.missed.push(key);
    this.setFailed(key, error);
    this.setKeyStatus(key, false);
  }

  setPassed(key: string): void {
    this.passed.push(key);
    this.setKeyStatus(key, true);
  }

  setFailed(key: string, msg?: string): void {
    if (!(key in this.errorsByKeys)) {
        this.errorsByKeys[key] = [];
    }

    this.failed.push(key);
    this.setKeyStatus(key, false);

    if (!msg) return;

    this.errors.push(msg);
    this.errorsByKeys[key].push(msg);
  }

  joinErrors(separator = '; '): string {
    return _errors.joinErrors(this.errors, separator);
  }

  merge(resultsNew: ResultInput): ValidnoResult {
    this.failed = [...this.failed, ...resultsNew.failed];
    this.errors = [...this.errors, ...resultsNew.errors];
    this.missed = [...this.missed, ...resultsNew.missed];
    this.passed = [...this.passed, ...resultsNew.passed];
    this.byKeys = { ...this.byKeys, ...resultsNew.byKeys };

    for (const key in resultsNew.errorsByKeys) {
        if (!(key in this.errorsByKeys)) {
            this.errorsByKeys[key] = [];
        }

        this.errorsByKeys[key] = [
            ...this.errorsByKeys[key],
            ...resultsNew.errorsByKeys[key]
        ];
    }

    return this;
  }

  clearEmptyErrorsByKeys(): void {
    for (const key in this.errorsByKeys) {
        if (!this.errorsByKeys[key].length) {
            delete this.errorsByKeys[key];
        }
    }
  }

  finish(): ValidnoResult {
    if (this.failed.length || this.errors.length) {
        this.ok = false;
    } else {
        this.ok = true;
    }

    this.clearEmptyErrorsByKeys();

    return this;
  }

  data(): ResultInput {
    return {
        ok: this.ok,
        missed: this.missed,
        failed: this.failed,
        passed: this.passed,
        errors: this.errors,
        byKeys: this.byKeys,
        errorsByKeys: this.errorsByKeys,
    };
  }

  isValid(): boolean {
    return this.ok === true;
  }
}

export default ValidnoResult