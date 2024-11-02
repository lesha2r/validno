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
    },
    val3: {
        type: String,
        required: true,
    },
});
const testObj = {
    val: 'string',
    val2: 1,
    val3: 'ss'
};
const resAll = schema.validate(testObj);
const res = schema.validate(testObj, ['val', 'val2']);
const res2 = schema.validate(testObj, 'val2');
console.log(resAll);
console.log(res);
console.log(res2);
