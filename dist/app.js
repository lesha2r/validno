import Schema from "./index.js";
const schema = new Schema({
    val: {
        type: String,
        required: true,
    },
    val2: {
        type: Number,
        required: true,
        rules: {
            min: 3
        }
    }
});
const testObj = {
    val: 'string',
    val2: 1
};
const res = schema.validate(testObj);
const res2 = schema.validateKey('val2', testObj);
console.log(res);
console.log(res2);
