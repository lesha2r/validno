import Schema from "./index.js";
const schema = new Schema({
    val: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    obj: {
        type: Object,
        required: true,
    },
    bool: {
        type: Boolean,
        required: true,
    },
    val2: {
        type: Number,
        required: true,
        rules: {
            min: 3
        }
    },
    srtOrNum: {
        type: [String, Number],
        required: true,
    },
    nl: {
        type: null,
        required: true,
    },
});
const testObj = {
    val: 'string',
    val2: 4,
    obj: {},
    srtOrNum: ['ss'],
    date: new Date(),
    bool: true,
    nl: null
};
const resAll = schema.validate(testObj);
const str = 'test';
