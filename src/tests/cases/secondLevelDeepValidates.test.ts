/* eslint-disable no-unused-vars */
import {describe, expect, test} from '@jest/globals';
import { Schema } from '../../Schema';

// [Case]
// Second level deep validation fails main parent even if all childs are valid
//
// [Description]
// Scheme where parent: {deep: deep2: 'value'} shows parent as invalid even if all childs are valid.
// 
// [Examples]
// 
// const configSchema = new Schema({
  // app: {
  //   name: {
  //     type: String,
  //     required: true,
  //     rules: { lengthMin: 1, lengthMax: 50 }
  //   },
  //   version: {
  //     type: String,
  //     required: true,
  //     rules: {
  //       regex: /^\d+\.\d+\.\d+$/ // Semantic versioning
  //     }
  //   },
  //   environment: {
  //     type: String,
  //     required: true,
  //     rules: {
  //       enum: ['development', 'testing', 'staging', 'production']
  //     }
  //   }
  // },
  // database: {
  //   host: {
  //     type: String,
  //     required: true,
  //     rules: { lengthMin: 1 }
  //   },
  //   port: {
  //     type: Number,
  //     required: true,
  //     rules: { min: 1, max: 65535 }
  //   },
  //   name: {
  //     type: String,
  //     required: true,
  //     rules: { lengthMin: 1, lengthMax: 64 }
  //   },
  //   ssl: {
  //     type: Boolean,
  //     required: false
  //   }
  // },
//   api: {
//     port: {
//       type: Number,
//       required: true,
//       rules: { min: 1000, max: 9999 }
//     },
//     cors: {
//       enabled: { type: Boolean, required: true },
//       origins: {
//         type: Array,
//         eachType: String,
//         required: false
//       }
//     },
//     rateLimit: {
//       enabled: { type: Boolean, required: true },
//       maxRequests: {
//         type: Number,
//         required: false,
//         rules: { min: 1, max: 10000 }
//       },
//       windowMs: {
//         type: Number,
//         required: false,
//         rules: { min: 1000, max: 86400000 } // 1 second to 1 day
//       }
//     }
//   }
// });
//
// const exampleConfigFile = {
//   "app": {
//     "name": "MyApp",
//     "version": "1.0.0",
//     "environment": "development"
//   },
//   "database": {
//     "host": "localhost",
//     "port": 5432,
//     "name": "myappdb",
//     "ssl": false
//   },
//   "api": {
//     "port": 3000,
//     "cors": {
//       "enabled": true,
//       "origins": ["http://localhost:3000"]
//     },
//     "rateLimit": {
//       "enabled": true,
//       "maxRequests": 1000,
//       "windowMs": 60000
//     }
//   },
// };

// const res = configSchema.validate(exampleConfigFile)

// res.ok = false
// res.failed = ['api']

const configSchema = new Schema({
  app: {
    name: {
      type: String,
      required: true,
      rules: { lengthMin: 1, lengthMax: 50 }
    },
    version: {
      type: String,
      required: true,
      rules: {
        regex: /^\d+\.\d+\.\d+$/ // Semantic versioning
      }
    },
    environment: {
      type: String,
      required: true,
      rules: {
        enum: ['development', 'testing', 'staging', 'production']
      }
    }
  },
  database: {
    host: {
      type: String,
      required: true,
      rules: { lengthMin: 1 }
    },
    port: {
      type: Number,
      required: true,
      rules: { min: 1, max: 65535 }
    },
    name: {
      type: String,
      required: true,
      rules: { lengthMin: 1, lengthMax: 64 }
    },
    ssl: {
      type: Boolean,
      required: false
    }
  },
  api: {
    port: {
      type: Number,
      required: true,
      rules: { min: 1000, max: 9999 }
    },
    cors: {
      enabled: { type: Boolean, required: true },
      origins: {
        type: Array,
        eachType: String,
        required: false
      }
    },
    rateLimit: {
      enabled: { type: Boolean, required: true },
      maxRequests: {
        type: Number,
        required: false,
        rules: { min: 1, max: 10000 }
      },
      windowMs: {
        type: Number,
        required: false,
        rules: { min: 1000, max: 86400000 } // 1 second to 1 day
      }
    }
  }
});

const exampleConfigFile = {
  "app": {
    "name": "MyApp",
    "version": "1.0.0",
    "environment": "development"
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myappdb",
    "ssl": false
  },
  "api": {
    "port": 3000,
    "cors": {
      "enabled": true,
      "origins": ["http://localhost:3000"]
    },
    "rateLimit": {
      "enabled": true,
      "maxRequests": 1000,
      "windowMs": 60000
    }
  },
};

describe('Second level deep validates as expected', () => {
  test('should validate the api key', () => {
    const res = configSchema.validate(exampleConfigFile);
    expect(res.ok).toBe(true);
    expect(res.failed).toEqual([]);
    expect(res.missed).toEqual([]);
  });

  test('api key shouldn\'t validate with wrong port type', () => {
    const res2 = configSchema.validate({
        ...exampleConfigFile,
        api: {
            ...exampleConfigFile.api,
            port: '99999' as any
        }
    })
    expect(res2.ok).toBe(false);
    expect(res2.failed).toContain('api');
  });
});
