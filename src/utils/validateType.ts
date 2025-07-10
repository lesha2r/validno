import { ValidationDetails } from "../constants/details.js"

export type TypeValidationResult = {
  key: string;
  passed: boolean;
  details?: string;
}

const _validateType = {
  getResult: (
    key: string,
    passed: boolean,
    details: string = ValidationDetails.OK
  ): TypeValidationResult => {
      return {
        key: key,
        passed: passed,
        details: details,
    }
  }
}

export default _validateType