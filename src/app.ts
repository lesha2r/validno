import Schema from "./index.js";

const testSchema1 = new Schema({
  isMissing: {
    required: false,
    type: 'any',
  },
  category: {
    required: true,
    type: String,
    rules: {
      lengthMinMax: [5,10]
    }
  },
  costPrice: {
    required: true,
    type: Number,
  },
  dateFrom: {
    required: true,
    type: Date,
    
  },
  isActive: {
    required: true,
    type: Boolean,
  },
  list: {
    required: true,
    type: Array,
  },
  listTyped: {
    required: true,
    type: Array,
    eachType: Number
  },
  xNull: {
    required: true,
    type: [null, Number]
  },
  reg: {
    required: true,
    type: RegExp
  },
  oneOfStr: {
    required: false,
    type: String,
    rules: {
      enum: ['done', 'new', 'cancel']
    }
  },
  email: {
    required: true,
    type: String,
    rules: {
      isEmail: true,
      lengthMin: 55
    },
  }
}
)

const okObj1 = {
    unknown: 1,
    category: 'xx',
    isMissing: '...',
    isActive: true,
    costPrice: 100,
    dateFrom: new Date(),
    list: [],
    listTyped: [1, 2, 3, 0.00001],
    xNull: null,
    reg: new RegExp('.*'),
    oneOfStr: 'done',
    email: 'xxx@gmail.com'
}

const okObjResult = testSchema1.validate(okObj1)
// console.log(okObjResult)

// const rulesSchema = new Schema({
//     xMultiple: {
//       required: true,
//       type: [String, null]
//     },
//     xNumb: {
//         required: true,
//         type: 'any',
//         rules: {
//             custom: (v: any) => v === 3,
//             is: 3,
//             isNot: 2,
//             min: 3,
//             max: 3,
//             regex: /3|4/
//         }
//     },
//     xStr: {
//         required: true,
//         type: String,
//         rules: {
//             custom: (v: any) => typeof v === 'string',
//             is: 'lol',
//             isNot: 'rofl',
//             length: 3,
//             lengthNot: 999,
//             lengthMin: 3,
//             lengthMax: 3,
//             regex: /\D{3}/
//         }
//     },
//     xArrEach: {
//       required: true,
//       type: Array,
//       eachType: [Number, String]
//     },
//     str: {
//       required: false,
//       type: String
//     }
// })

// const rulesObj = {
//     xMultiple: 'str',
//     xNumb: 3,
//     xStr: 'lol',
//     xArrEach: [3,2,1,null],
//     str: '233'
// }

// const rulesObjResult = Validator.validate(rulesSchema, rulesObj)
// console.log(rulesObjResult)

const deepObjScheme = new Schema({
  nameStr: {
    required: true,
    type: String,
    rules: {
      lengthMin: 5
    }
  },
  address: {
    city: {
      required: true,
      type: String,
    },
    street: {
      required: true,
      type: String
    },
    coords: {
      x: {
        required: true,
        type: Number,
      },
      y: {
        required: true,
        type: Number,
        rules: {
          min: 1
        }
      }
    },
  },
  deep1: {
    deep2: {
      deep3: {
        deep4: {
          required: true,
          type: String,
          rules: {
            lengthMinMax: [10,15]
          }
        }
      }
    }
  }
})

const deepTestObj = {
  nameStr: "Alek",
  address: {
    city: 'Moscow',
    street: "41, Komsomolskiy",
    coords: {
      x: 1,
      y: 2
    }
  },
  deep1: {
    deep2: {
      deep3: {
        deep4: 'ssss'
      }
    }
  }
}

// console.log('deepObj', deepObjScheme.validate(deepTestObj).ok)

const ownStockSchema = new Schema({
  supplierArticle: {
    type: String,
    required: true,
  },
  ownStockQty: {
    type: Number,
    required: true,
  },
});

const body = {
  "supplierArticle": "VisitBezh",
  "ownStockQty1": 1000.1234
}

const validationResult = ownStockSchema.validate(body);

console.log(validationResult)