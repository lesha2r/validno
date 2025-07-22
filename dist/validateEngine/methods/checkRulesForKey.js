import validateRules from "../../validateRules.js";
function checkRulesForKey(input) {
    const { results, nestedKey, value, reqs, data, rulesChecked } = input;
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
export default checkRulesForKey;
