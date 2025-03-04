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
    this.byKeys = results?.byKeys || {}
  }

  fixByKey(key: string, result: boolean) {
    this.byKeys[key] = result

    if (result === true) this.passed.push(key)
    else this.failed.push(key)
  }

  pushMissing(key: string, errMsg?: string) {
    this.missed.push(key)
    this.fixByKey(key, false)

    const error = errMsg || _errors.getMissingError(key)

    this.pushError(key, error)
  }

  pushError(key: string, msg: string) {
    if (key in this.errorsByKeys === false) {
        this.errorsByKeys[key] = []
    }

    this.byKeys[key] = false
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

    finish() {
        if (this.failed.length) this.ok = false
        else this.ok = true 

        return this
    }
}

export default ValidnoResult