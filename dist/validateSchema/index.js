import ValidateEngine from "./ValidateEngine.js";
const validateSchema = (schemaDef, data, keysToValidate) => {
    const engine = new ValidateEngine(schemaDef);
    return engine.validate(data, keysToValidate);
};
export default validateSchema;
