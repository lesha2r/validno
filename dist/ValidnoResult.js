import _errors from "./utils/errors.js";
class ValidnoResult {
    constructor(results) {
        this.ok = (results === null || results === void 0 ? void 0 : results.ok) !== undefined ? results.ok : null;
        this.missed = (results === null || results === void 0 ? void 0 : results.missed) || [];
        this.failed = (results === null || results === void 0 ? void 0 : results.failed) || [];
        this.passed = (results === null || results === void 0 ? void 0 : results.passed) || [];
        this.errors = (results === null || results === void 0 ? void 0 : results.errors) || [];
        this.byKeys = (results === null || results === void 0 ? void 0 : results.byKeys) || {};
        this.errorsByKeys = (results === null || results === void 0 ? void 0 : results.errorsByKeys) || {};
        this.byKeys = (results === null || results === void 0 ? void 0 : results.byKeys) || {};
    }
    setKeyStatus(key, result) {
        this.byKeys[key] = result;
    }
    fixParentByChilds(parentKey, childChecks = []) {
        const isEveryOk = childChecks.every(c => c === true);
        this.setKeyStatus(parentKey, isEveryOk);
        if (isEveryOk === true)
            this.setPassed(parentKey);
        else
            this.setFailed(parentKey);
    }
    setMissing(key, errMsg) {
        const error = errMsg || _errors.getMissingError(key);
        this.missed.push(key);
        this.setFailed(key, error);
        this.setKeyStatus(key, false);
    }
    setPassed(key) {
        this.passed.push(key);
        this.setKeyStatus(key, true);
    }
    setFailed(key, msg) {
        if (key in this.errorsByKeys === false) {
            this.errorsByKeys[key] = [];
        }
        this.failed.push(key);
        this.setKeyStatus(key, false);
        if (!msg)
            return;
        this.errors.push(msg);
        this.errorsByKeys[key].push(msg);
    }
    joinErrors(separator = '; ') {
        return _errors.joinErrors(this.errors, separator);
    }
    merge(resultsNew) {
        this.failed = [...this.failed, ...resultsNew.failed];
        this.errors = [...this.errors, ...resultsNew.errors];
        this.missed = [...this.missed, ...resultsNew.missed];
        this.passed = [...this.passed, ...resultsNew.passed];
        this.byKeys = Object.assign(Object.assign({}, this.byKeys), resultsNew.byKeys);
        for (const key in resultsNew.errorsByKeys) {
            if (key in this.errorsByKeys === false)
                this.errorsByKeys[key] = [];
            this.errorsByKeys[key] = [
                ...this.errorsByKeys[key],
                ...resultsNew.errorsByKeys[key]
            ];
        }
        return this;
    }
    clearEmptyErrorsByKeys() {
        for (const key in this.errorsByKeys) {
            if (!this.errorsByKeys[key].length) {
                delete this.errorsByKeys[key];
            }
        }
    }
    finish() {
        if (this.failed.length)
            this.ok = false;
        else
            this.ok = true;
        this.clearEmptyErrorsByKeys();
        return this;
    }
}
export default ValidnoResult;
