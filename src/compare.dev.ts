import { z } from 'zod';
import * as v from 'valibot';
import * as yup from 'yup';
import Joi from 'joi';
// @ts-ignore - validno is an ES module
import Schema from 'validno';

// Test data schema interface
interface TestData {
  // missing field test - will be undefined in some objects
  optionalField?: string;
  // string field
  name: string;
  // string with minimum length (min 3)
  username: string;
  // number
  age: number;
  // number with min and max (10-100)
  score: number;
  // array of strings
  tags: string[];
  // nested object
  address: {
    city: string;
    country: string;
  };
  // Date
  createdAt: Date;
  // boolean
  isActive: boolean;
  // null
  metadata: null;
}

// Zod schema
const zodSchema = z.object({
  optionalField: z.string().optional(),
  name: z.string(),
  username: z.string().min(3),
  age: z.number(),
  score: z.number().min(10).max(100),
  tags: z.array(z.string()),
  address: z.object({
    city: z.string(),
    country: z.string(),
  }),
  createdAt: z.date(),
  isActive: z.boolean(),
  metadata: z.null(),
});

// Valibot schema
const valibotSchema =  v.object({
  optionalField: v.optional(v.string()),
  name: v.string(),
  username: v.pipe(v.string(), v.minLength(3)),
  age: v.number(),
  score: v.pipe(v.number(), v.minValue(10), v.maxValue(100)),
  tags: v.array(v.string()),
  address: v.object({
    city: v.string(),
    country: v.string(),
  }),
  createdAt: v.date(),
  isActive: v.boolean(),
  metadata: v.null_(),
});

// Validno V1 schema
const validnoSchema = new Schema({
  optionalField: {type: String, required: false,},
  name: {type: String, required: true,},
  username: {type: String, required: true, rules: {lengthMin: 3,}},
  age: {type: Number, required: true,},
  score: {type: Number, required: true, rules: {min: 10, max: 100}},
  tags: {type: Array, required: true, eachType: String},
  address: {
    city: {type: String, required: true},
    country: {type: String, required: true},
  },
  createdAt: {type: Date, required: true},
  isActive: {type: Boolean, required: true},
  metadata: {type: null, required: true},
});

// Yup schema
const yupSchema = yup.object({
  optionalField: yup.string().optional(),
  name: yup.string().required(),
  username: yup.string().min(3).required(),
  age: yup.number().required(),
  score: yup.number().min(10).max(100).required(),
  tags: yup.array().of(yup.string().required()).required(),
  address: yup.object({
    city: yup.string().required(),
    country: yup.string().required(),
  }).required(),
  createdAt: yup.date().required(),
  isActive: yup.boolean().required(),
  metadata: yup.mixed().nullable(),
});

// Joi schema
const joiSchema = Joi.object({
  optionalField: Joi.string().optional(),
  name: Joi.string().required(),
  username: Joi.string().min(3).required(),
  age: Joi.number().required(),
  score: Joi.number().min(10).max(100).required(),
  tags: Joi.array().items(Joi.string()).required(),
  address: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  createdAt: Joi.date().required(),
  isActive: Joi.boolean().required(),
  metadata: Joi.any().valid(null).required(),
});

// Generate test objects
const testObjects: TestData[] = [];

const objectCount = 10000; // ⬅️ Set number of objects to generate

let i=0;
while (i < objectCount) {
  testObjects.push({
    name: `User ${i}${Math.random().toString(36).substring(2, 7)}`,
    username: `user${i}${i+2}`,
    age: 20 + (i % 30),
    score: 50 + (i % 50),
    tags: [`tag${i % 5}`, `${Math.random().toString(36).substring(2, 7)}`],
    address: { city: `City ${i}`, country: `Country ${i}` },
    createdAt: new Date(),
    isActive: i % 2 === 0,
    metadata: null,
  });

  i++;
}
// Benchmark function
function benchmark(name: string, validationFn: (data: any) => void, iterations: number) {
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    for (const obj of testObjects) {
      // Convert Date to ISO string for V2 (since it doesn't have Date type yet)
      const testData = name === 'Validno V2' ? {
        ...obj,
        createdAt: obj.createdAt.toISOString(),
        metadata: null as any, // V2 treats this as optional nullable
      } : obj;
      
      validationFn(testData);
    }
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const totalValidations = iterations * testObjects.length;
  
  return {
    library: name,
    totalTime: totalTime.toFixed(2),
    totalValidations,
    avgTimePerValidation: (totalTime / totalValidations).toFixed(6),
  };
}

// Schema creation benchmark
function benchmarkSchemaCreation(name: string, createSchemaFn: () => void, iterations: number) {
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    createSchemaFn();
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  
  return {
    library: name,
    totalTime: totalTime.toFixed(2),
    iterations,
    avgTimePerCreation: (totalTime / iterations).toFixed(6),
  };
}

// Run benchmarks
const iterations = 1;
console.log(`\n🚀 Validation Library Benchmark`);
console.log(`===============================`);
console.log(`Test objects: ${testObjects.length}`);
console.log(`Iterations: ${iterations.toLocaleString()}`);
console.log(`Total validations per library: ${(iterations * testObjects.length).toLocaleString()}\n`);

const results = [];
const schemaResults = [];

// Zod
console.log('Testing Zod...');
const zodResult = benchmark('Zod', (data) => zodSchema.parse(data), iterations);
results.push(zodResult);

// Valibot
console.log('Testing Valibot...');
const valibotResult = benchmark('Valibot', (data) => v.parse(valibotSchema, data), iterations);
results.push(valibotResult);

// Validno V1
console.log('Testing Validno V1...');
const validnoResult = benchmark('Validno V1', (data) => validnoSchema.validate(data), iterations);
results.push(validnoResult);

// Joi
console.log('Testing Joi...');
const joiResult = benchmark('Joi', (data) => joiSchema.validate(data), iterations);
results.push(joiResult);

// Schema Creation Benchmarks
console.log('\n⏱️  Testing Schema Creation Performance...\n');

const schemaCreationIterations = 100000; // ⬅️ Set

console.log('Testing Zod schema creation...');
const zodSchemaResult = benchmarkSchemaCreation('Zod', () => {
  z.object({
    optionalField: z.string().optional(),
    name: z.string(),
    username: z.string().min(3),
    age: z.number(),
    score: z.number().min(10).max(100),
    tags: z.array(z.string()),
    address: z.object({
      city: z.string(),
      country: z.string(),
    }),
    createdAt: z.date(),
    isActive: z.boolean(),
    metadata: z.null(),
  });
}, schemaCreationIterations);
schemaResults.push(zodSchemaResult);

console.log('Testing Valibot schema creation...');
const valibotSchemaResult = benchmarkSchemaCreation('Valibot', () => {
  v.object({
    optionalField: v.optional(v.string()),
    name: v.string(),
    username: v.pipe(v.string(), v.minLength(3)),
    age: v.number(),
    score: v.pipe(v.number(), v.minValue(10), v.maxValue(100)),
    tags: v.array(v.string()),
    address: v.object({
      city: v.string(),
      country: v.string(),
    }),
    createdAt: v.date(),
    isActive: v.boolean(),
    metadata: v.null_(),
  });
}, schemaCreationIterations);
schemaResults.push(valibotSchemaResult);

console.log('Testing Validno schema creation...');
const validnoSchemaResult = benchmarkSchemaCreation('Validno V1', () => {
  new Schema({
    optionalField: {type: String, required: false,},
    name: {type: String, required: true,},
    username: {type: String, required: true, rules: {lengthMin: 3,}},
    age: {type: Number, required: true,},
    score: {type: Number, required: true, rules: {min: 10, max: 100}},
    tags: {type: Array, required: true, eachType: String},
    address: {
      city: {type: String, required: true},
      country: {type: String, required: true},
    },
    createdAt: {type: Date, required: true},
    isActive: {type: Boolean, required: true},
    metadata: {type: null, required: true},
  });
}, schemaCreationIterations);
schemaResults.push(validnoSchemaResult);

console.log('Testing Joi schema creation...');
const joiSchemaResult = benchmarkSchemaCreation('Joi', () => {
  Joi.object({
    optionalField: Joi.string().optional(),
    name: Joi.string().required(),
    username: Joi.string().min(3).required(),
    age: Joi.number().required(),
    score: Joi.number().min(10).max(100).required(),
    tags: Joi.array().items(Joi.string()).required(),
    address: Joi.object({
      city: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    createdAt: Joi.date().required(),
    isActive: Joi.boolean().required(),
    metadata: Joi.any().valid(null).required(),
  });
}, schemaCreationIterations);
schemaResults.push(joiSchemaResult);

console.log('Testing Yup schema creation...');
const yupSchemaResult = benchmarkSchemaCreation('Yup', () => {
  yup.object({
    optionalField: yup.string().optional(),
    name: yup.string().required(),
    username: yup.string().min(3).required(),
    age: yup.number().required(),
    score: yup.number().min(10).max(100).required(),
    tags: yup.array().of(yup.string().required()).required(),
    address: yup.object({
      city: yup.string().required(),
      country: yup.string().required(),
    }).required(),
    createdAt: yup.date().required(),
    isActive: yup.boolean().required(),
    metadata: yup.mixed().nullable(),
  });
}, schemaCreationIterations);
schemaResults.push(yupSchemaResult);

// Display results
console.log('\n📊 Results:');
console.log('==========\n');

// Sort by total time
results.sort((a, b) => parseFloat(a.totalTime) - parseFloat(b.totalTime));

console.log('┌─────────────┬──────────────┬────────────────────┬─────────────────────────┐');
console.log('│ Library     │ Total Time   │ Total Validations  │ Avg Time/Validation     │');
console.log('├─────────────┼──────────────┼────────────────────┼─────────────────────────┤');

results.forEach((result, index) => {
  const rank = index === 0 ? '🏆 ' : '   ';
  const library = result.library.padEnd(9);
  const totalTime = `${result.totalTime} ms`.padEnd(12);
  const totalValidations = result.totalValidations.toLocaleString().padEnd(18);
  const avgTime = `${result.avgTimePerValidation} ms`.padEnd(23);
  
  console.log(`│ ${rank}${library} │ ${totalTime} │ ${totalValidations} │ ${avgTime} │`);
});

console.log('└─────────────┴──────────────┴────────────────────┴─────────────────────────┘');

// Performance comparison
const fastest = results[0];
const slowest = results[results.length - 1];
const speedDiff = ((parseFloat(slowest.totalTime) / parseFloat(fastest.totalTime)) - 1) * 100;

console.log(`\n💡 Summary:`);
console.log(`   Fastest: ${fastest.library} (${fastest.totalTime} ms)`);
console.log(`   Slowest: ${slowest.library} (${slowest.totalTime} ms)`);
console.log(`   Difference: ${slowest.library} is ${speedDiff.toFixed(1)}% slower than ${fastest.library}\n`);

// Display schema creation results
console.log('\n📊 Schema Creation Results:');
console.log('===========================\n');

// Sort by total time
schemaResults.sort((a, b) => parseFloat(a.totalTime) - parseFloat(b.totalTime));

console.log('┌─────────────┬──────────────┬────────────────┬─────────────────────────┐');
console.log('│ Library     │ Total Time   │ Iterations     │ Avg Time/Creation       │');
console.log('├─────────────┼──────────────┼────────────────┼─────────────────────────┤');

schemaResults.forEach((result, index) => {
  const rank = index === 0 ? '🏆 ' : '   ';
  const library = result.library.padEnd(9);
  const totalTime = `${result.totalTime} ms`.padEnd(12);
  const iterations = result.iterations.toLocaleString().padEnd(14);
  const avgTime = `${result.avgTimePerCreation} ms`.padEnd(23);
  
  console.log(`│ ${rank}${library} │ ${totalTime} │ ${iterations} │ ${avgTime} │`);
});

console.log('└─────────────┴──────────────┴────────────────┴─────────────────────────┘');

// Schema creation comparison
const fastestSchema = schemaResults[0];
const slowestSchema = schemaResults[schemaResults.length - 1];
const schemaSpeedDiff = ((parseFloat(slowestSchema.totalTime) / parseFloat(fastestSchema.totalTime)) - 1) * 100;

console.log(`\n💡 Schema Creation Summary:`);
console.log(`   Fastest: ${fastestSchema.library} (${fastestSchema.totalTime} ms for ${schemaCreationIterations.toLocaleString()} schemas)`);
console.log(`   Slowest: ${slowestSchema.library} (${slowestSchema.totalTime} ms for ${schemaCreationIterations.toLocaleString()} schemas)`);
console.log(`   Difference: ${slowestSchema.library} is ${schemaSpeedDiff.toFixed(1)}% slower than ${fastestSchema.library}`);
console.log(`   Per-schema cost: ${fastestSchema.library} = ${fastestSchema.avgTimePerCreation}ms, ${slowestSchema.library} = ${slowestSchema.avgTimePerCreation}ms\n`);

// BaaS Impact Analysis
console.log('\n🎯 BaaS Impact Analysis:');
console.log('========================\n');
console.log('Scenario: 100 customers, each with 1 schema loaded on cold start\n');

schemaResults.forEach((result) => {
  const coldStartTime = (parseFloat(result.avgTimePerCreation) * 100).toFixed(2);
  console.log(`${result.library.padEnd(12)} → Cold start overhead: ${coldStartTime}ms for 100 schemas`);
});

console.log('\nScenario: Dynamic schema creation (1 schema per API request)\n');
schemaResults.forEach((result) => {
  console.log(`${result.library.padEnd(12)} → Per-request overhead: ${result.avgTimePerCreation}ms`);
});

console.log('\n');
