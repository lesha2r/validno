import validateType from "../../validateType.js";
import validateRules from "../../validateRules.js";
import { ValidationIds } from "../../constants/details.js";
import ValidnoResult from "../../ValidnoResult.js";
import _errors from "../../utils/errors.js";
import _helpers from "../../utils/helpers.js";
import validate from "../validate.js";
class ValidateEngine {
    constructor(definition) {
        this.definition = definition;
        this.result = new ValidnoResult();
    }
    validate(data, validationKeys) {
        return validate.call(this, data, validationKeys);
    }
    handleMissingKey(schema, input) {
        const { key, nestedKey, data, reqs } = input;
        const messageKey = nestedKey || key;
        const messageTitle = reqs.title || messageKey;
        if (!reqs.customMessage) {
            return _errors.getMissingError(messageKey);
        }
        const errorMessage = reqs.customMessage({
            keyword: ValidationIds.Missing,
            value: data[key],
            key: messageKey,
            title: messageTitle,
            reqs,
            schema,
        });
        return errorMessage;
    }
    validateNestedKey(input) {
        const { results, key, nestedKey, data, reqs } = input;
        const nestedKeys = Object.keys(reqs);
        const nestedResults = [];
        for (const itemKey of nestedKeys) {
            const deepParams = {
                key: itemKey,
                data: data[key],
                reqs: reqs[itemKey],
                nestedKey: `${nestedKey}.${itemKey}`
            };
            const deepResults = this.validateKey(deepParams);
            nestedResults.push(deepResults.ok);
            results.merge(deepResults);
        }
        results.fixParentByChilds(nestedKey, nestedResults);
        return results;
    }
    validateKey(input) {
        let { results, key, nestedKey, data, reqs } = input;
        if (data === undefined) {
            const noDataResult = new ValidnoResult();
            noDataResult.setNoData();
            noDataResult.finish();
            return noDataResult;
        }
        if (!results)
            results = new ValidnoResult();
        if (!nestedKey)
            nestedKey = key;
        const hasMissing = _helpers.hasMissing(input);
        if (_helpers.checkNestedIsMissing(reqs, data)) {
            return this.handleMissingNestedKey(results, nestedKey);
        }
        if (_helpers.checkIsNested(reqs)) {
            return this.validateNestedKey({ results, key, data, reqs, nestedKey });
        }
        return this.validateKeyDetails({
            results,
            key,
            nestedKey,
            data,
            reqs,
            hasMissing,
        });
    }
    handleMissingNestedKey(results, nestedKey) {
        results.setMissing(nestedKey);
        return results;
    }
    validateKeyDetails(params) {
        const { results, key, nestedKey, data, reqs, hasMissing } = params;
        const missedCheck = [];
        const typeChecked = [];
        const rulesChecked = [];
        if (hasMissing) {
            return this.handleMissingKeyValidation({ results, key, nestedKey, data, reqs }, missedCheck);
        }
        this.checkValueType(results, key, data[key], reqs, nestedKey, typeChecked);
        this.checkRulesForKey(results, nestedKey, data[key], reqs, data, rulesChecked);
        return this.finalizeValidation({ results, nestedKey, missedCheck, typeChecked, rulesChecked });
    }
    handleMissingKeyValidation(params, missedCheck) {
        const schema = this.definition;
        const { results, key, nestedKey, data, reqs } = params;
        const errMsg = this.handleMissingKey(schema, { key, nestedKey, data, reqs });
        missedCheck.push(false);
        results.setMissing(nestedKey, errMsg);
        return results;
    }
    checkValueType(results, key, value, reqs, nestedKey, typeChecked) {
        const typeCheck = validateType(key, value, reqs, nestedKey);
        typeCheck.forEach((res) => {
            if (!res.passed) {
                typeChecked.push(false);
                results.errors.push(res.details || '');
            }
        });
    }
    checkRulesForKey(results, nestedKey, value, reqs, data, rulesChecked) {
        const ruleCheck = validateRules.call(this, nestedKey, value, reqs, data);
        if (!ruleCheck.ok) {
            rulesChecked.push(false);
            ruleCheck.details.forEach((el) => {
                if (!(nestedKey in results.errorsByKeys))
                    results.errorsByKeys[nestedKey] = [];
                results.errors.push(el);
                results.errorsByKeys[nestedKey] = ['1'];
            });
        }
    }
    finalizeValidation(checks) {
        const { results, nestedKey, missedCheck, typeChecked, rulesChecked } = checks;
        if (missedCheck.length)
            results.setMissing(nestedKey);
        const isPassed = !typeChecked.length && !rulesChecked.length && !missedCheck.length;
        if (!isPassed) {
            results.setFailed(nestedKey);
            results.errorsByKeys[nestedKey] = [...results.errors];
        }
        else {
            results.setPassed(nestedKey);
        }
        return results.finish();
    }
}
export default ValidateEngine;
