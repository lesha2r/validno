import _errors from "./utils/errors.js"

export type TResult = {
    ok: null | boolean,
    missed: string[],
    failed: string[],
    passed: string[],
    errors: string[],
    byKeys: {[key: string]: boolean},
    errorsByKeys: {[key: string]: string[]},
};

interface ValidnoResult extends TResult {}

class ValidnoResult {
  constructor(results?: TResult) {
    this.ok = results?.ok !== undefined ? results.ok : null
    this.missed = results?.missed || []
    this.failed = results?.failed || []
    this.passed = results?.passed || []
    this.errors = results?.errors || []
    this.byKeys = results?.byKeys || {}
    this.errorsByKeys = results?.errorsByKeys || {}
  }

  setKeyStatus(key: string, result: boolean) {
    this.byKeys[key] = result
  }

  fixParentByChilds(parentKey: string, childChecks: boolean[] = []) {
    const isEveryOk = childChecks.every(c => c === true)
    this.setKeyStatus(parentKey, isEveryOk)

    if (isEveryOk === true) this.setPassed(parentKey)
    else this.setFailed(parentKey)

  }

  setMissing(key: string, errMsg?: string) {
    const error = errMsg || _errors.getMissingError(key)

    this.missed.push(key)
    this.setFailed(key, error)
    this.setKeyStatus(key, false)
  }

  setPassed(key: string) {
    this.passed.push(key)
    this.setKeyStatus(key, true)
  }

  setFailed(key: string, msg?: string) {
    if (key in this.errorsByKeys === false) {
        this.errorsByKeys[key] = []
    }

    this.failed.push(key)
    this.setKeyStatus(key, false)

    if (!msg) return

    this.errors.push(msg)
    this.errorsByKeys[key].push(msg)
  }

  joinErrors(separator = '; ') {
    return _errors.joinErrors(this.errors, separator)
  }

  merge(resultsNew: TResult) {
    this.failed = [...this.failed, ...resultsNew.failed]
    this.errors = [...this.errors, ...resultsNew.errors]
    this.missed = [...this.missed, ...resultsNew.missed]
    this.passed = [...this.passed, ...resultsNew.passed]
    this.byKeys = {...this.byKeys, ...resultsNew.byKeys}
    
    for (const key in resultsNew.errorsByKeys) {
        if (key in this.errorsByKeys === false) this.errorsByKeys[key] = []

        this.errorsByKeys[key] = [
            ...this.errorsByKeys[key],
            ...resultsNew.errorsByKeys[key]
        ]
    }
  
    return this
  }

  clearEmptyErrorsByKeys() {
    for (const key in this.errorsByKeys) {
      if (!this.errorsByKeys[key].length) {
        delete this.errorsByKeys[key]
      }
    }
  }

  finish() {
      if (this.failed.length) this.ok = false
      else this.ok = true 

      this.clearEmptyErrorsByKeys()

      return this
  }

  data() {
    return {
      ok: this.ok,
      missed: this.missed,
      failed: this.failed,
      passed: this.passed,
      errors: this.errors,
      byKeys: this.byKeys,
      errorsByKeys:this.errorsByKeys,
    }
  }
}

export default ValidnoResult