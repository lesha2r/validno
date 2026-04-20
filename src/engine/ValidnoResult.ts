import _errors from "../utils/errors.js";

export interface ResultInput {
  ok: null | boolean;
  missed: string[];
  failed: string[];
  passed: string[];
  errors: string[];
  byKeys: { [key: string]: boolean };
  errorsByKeys: { [key: string]: string[] };
  failFast?: boolean;  // Stop on first error
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
    
    // Store failFast as a non-enumerable property
    Object.defineProperty(this, 'failFast', {
      value: results?.failFast || false,
      writable: true,
      enumerable: false,  // Hide from Jest comparisons
      configurable: true
    });
  }
  
  // Accessor for failFast (TypeScript needs this)
  failFast!: boolean;

  setNoData(key: string): void {
    this.ok = false;
    // Optimized: use string concatenation
    this.errors = ["Missing value for '" + key + "'"];
  }

  setKeyStatus(key: string, result: boolean): void {
    this.byKeys[key] = result;
  }

  fixParentByChilds(parentKey: string, childChecks: boolean[] = []): void {
    const isEveryOk = childChecks.every(check => check === true);
    this.setKeyStatus(parentKey, isEveryOk);

    if (isEveryOk) this.setPassed(parentKey);
    else this.setFailed(parentKey);
  }

  setMissing(key: string, errMsg?: string): void {
    const error = errMsg || _errors.getMissingError(key);

    this.missed.push(key);
    this.failed.push(key);
    this.byKeys[key] = false;
    this.errors.push(error);
    
    if (!(key in this.errorsByKeys)) {
      this.errorsByKeys[key] = [];
    }
    this.errorsByKeys[key].push(error);
  }

  setPassed(key: string): void {
    this.passed.push(key);
    this.byKeys[key] = true;
  }

  setFailed(key: string, msg?: string): void {
    this.failed.push(key);
    this.byKeys[key] = false;
    
    // Always ensure errorsByKeys entry exists
    if (!(key in this.errorsByKeys)) {
      this.errorsByKeys[key] = [];
    }
    
    // Push message if provided
    if (msg) {
      this.errors.push(msg);
      this.errorsByKeys[key].push(msg);
    }
  }

  joinErrors(separator = '; '): string {
    return _errors.joinErrors(this.errors, separator);
  }

  merge(resultsNew: ResultInput): ValidnoResult {
    // Optimized: cache lengths and only merge arrays that have content
    const newFailedLen = resultsNew.failed.length;
    const newErrorsLen = resultsNew.errors.length;
    const newMissedLen = resultsNew.missed.length;
    const newPassedLen = resultsNew.passed.length;
    
    if (newFailedLen) {
      Array.prototype.push.apply(this.failed, resultsNew.failed);
    }
    if (newErrorsLen) {
      Array.prototype.push.apply(this.errors, resultsNew.errors);
    }
    if (newMissedLen) {
      Array.prototype.push.apply(this.missed, resultsNew.missed);
    }
    if (newPassedLen) {
      Array.prototype.push.apply(this.passed, resultsNew.passed);
    }

    // Direct assignment is faster than spread - only iterate if needed
    for (const key in resultsNew.byKeys) {
      this.byKeys[key] = resultsNew.byKeys[key];
    }

    for (const key in resultsNew.errorsByKeys) {
        if (!(key in this.errorsByKeys)) {
            this.errorsByKeys[key] = [];
        }
        Array.prototype.push.apply(this.errorsByKeys[key], resultsNew.errorsByKeys[key]);
    }
    
    // Preserve failFast setting
    if (resultsNew.failFast !== undefined) {
      this.failFast = resultsNew.failFast;
    }

    return this;
  }

  clearEmptyErrorsByKeys(): void {
    // Optimized: use for...in instead of Object.keys()
    for (const key in this.errorsByKeys) {
        if (this.errorsByKeys[key].length === 0) {
            delete this.errorsByKeys[key];
        }
    }
  }

  finish(): ValidnoResult {
    // Optimized: direct check
    this.ok = this.errors.length === 0;

    // Only clear if there are error keys (common case: no errors)
    let hasEmptyKeys = false;
    for (const key in this.errorsByKeys) {
      if (this.errorsByKeys[key].length === 0) {
        hasEmptyKeys = true;
        break;
      }
    }
    if (hasEmptyKeys) {
      this.clearEmptyErrorsByKeys();
    }

    return this;
  }

  data(): ResultInput {
    const result: ResultInput = {
        ok: this.ok,
        missed: this.missed,
        failed: this.failed,
        passed: this.passed,
        errors: this.errors,
        byKeys: this.byKeys,
        errorsByKeys: this.errorsByKeys,
    };
    
    // Only include failFast if it's true (for backward compatibility)
    if (this.failFast) {
      result.failFast = this.failFast;
    }
    
    return result;
  }

  isValid(): boolean {
    return this.ok === true;
  }
}

export default ValidnoResult