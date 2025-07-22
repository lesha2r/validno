import { ValidationDetails } from "../constants/details.js";
class TypeValidationUtility {
    getResult(key, passed, details = ValidationDetails.OK) {
        return {
            key,
            passed,
            details
        };
    }
}
const validateType = new TypeValidationUtility();
export default validateType;
