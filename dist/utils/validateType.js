import { EValidationDetails } from "../constants/details.js";
const _validateType = {
    getResult: (key, passed, details = EValidationDetails.OK) => {
        return {
            key: key,
            passed: passed,
            details: details,
        };
    }
};
export default _validateType;
