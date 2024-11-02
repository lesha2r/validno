import Schema from "./index.js";

// const testSchema = new Schema({
//   field: {
//     type: Number,
//     required: true,
//     rules: {
//       lengthMin: 99
//     }
//   },
//   field2: {
//     type: "xxx",
//     required: true,
//     rules: {
//       lengthMin: 10
//     }
//   }
// });

// class StringOwn {
//   constructor(v: any) {
//     v = v
//   }
// }

// const strOwn = new StringOwn('xxxxuis')

// const body = {
//   "field": 33,
//   "field2": "Ssdasjk"
// }

// const validationResult = testSchema.validate(body);


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
})

const testObj = {
  val: 'string',
  val2: 1
}

const res = schema.validate(testObj)
const res2 = schema.validateKey('val2', testObj)

console.log(res)
console.log(res2)