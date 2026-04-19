/**
 * docs.dev.ts
 *
 * Executable verification of every example from the Validno docs.
 * Run with:  npx ts-node --esm docs.dev.ts
 *
 * Each section mirrors a docs page.  A small helper prints pass/fail so
 * you can spot regressions without reading raw output.
 */

import Schema from '../dist/index.js';

// ─── helpers ────────────────────────────────────────────────────────────────

type Check = { label: string; ok: boolean };
const checks: Check[] = [];

function assert(label: string, ok: boolean) {
  checks.push({ label, ok });
  console.log(`  ${ok ? '✅' : '❌'} ${label}`);
}

function section(title: string) {
  console.log(`\n🔎 Section: ${title}`);
}

// ─── getting-started ────────────────────────────────────────────────────────

section('getting-started');

const userSchema = new Schema({
  name: { type: String, required: true, rules: { lengthMin: 2, lengthMax: 50 } },
  email: { type: String, required: true, rules: { isEmail: true } },
  age: { type: Number, required: false, rules: { min: 18, max: 120 } }
});

assert('valid user passes', userSchema.validate({ name: 'Barney Stinson', email: 'barney@himym.com', age: 18 }).ok);
assert('invalid email fails', !userSchema.validate({ name: 'Barney', email: 'not-an-email', age: 35 }).ok);
assert('missing required name fails', !userSchema.validate({ email: 'b@b.com', age: 35 }).ok);

// ─── schema-definition ──────────────────────────────────────────────────────

section('schema-definition');

const productSchema = new Schema({
  name: { type: String, required: true, rules: { lengthMin: 1, lengthMax: 100 } },
  price: { type: Number, required: true, rules: { min: 0 } },
  description: { type: String, required: false },
  inStock: { type: Boolean, required: true }
});

assert('valid product passes', productSchema.validate({ name: 'Laptop', price: 999.99, description: 'Fast laptop', inStock: true }).ok);
assert('negative price fails', !productSchema.validate({ name: 'Laptop', price: -1, inStock: true }).ok);

// ─── supported-types ────────────────────────────────────────────────────────

section('supported-types');

const typesSchema = new Schema({
  stringField: { type: String },
  numberField: { type: Number },
  booleanField: { type: Boolean },
  arrayField: { type: Array },
  objectField: { type: Object },
  dateField: { type: Date },
  regexField: { type: RegExp },
  nullField: { type: null },
  mixedField: { type: [String, Number] },
  optionalMixed: { type: [String, null] },
  anyField: { type: 'any' }
});

assert('all built-in types pass', typesSchema.validate({
  stringField: 'hello',
  numberField: 42,
  booleanField: true,
  arrayField: [1, 2, 3],
  objectField: { key: 'value' },
  dateField: new Date(),
  regexField: /pattern/,
  nullField: null,
  mixedField: 'can be string',
  optionalMixed: null,
  anyField: 'anything'
}).ok);

assert('wrong type fails', !typesSchema.validate({ stringField: 42, numberField: 42, booleanField: true, arrayField: [], objectField: {}, dateField: new Date(), regexField: /x/, nullField: null, mixedField: 'x', optionalMixed: null, anyField: 1 }).ok);

// Union types
const unionSchema = new Schema({ value: { type: [String, Number] } });
assert('union type accepts string', unionSchema.validate({ value: 'hello' }).ok);
assert('union type accepts number', unionSchema.validate({ value: 42 }).ok);
assert('union type rejects boolean', !unionSchema.validate({ value: true }).ok);

// ─── string-rules ───────────────────────────────────────────────────────────

section('string-rules');

const stringRulesSchema = new Schema({
  code:       { type: String, rules: { length: 10 } },
  password:   { type: String, rules: { lengthMin: 8 } },
  username:   { type: String, rules: { lengthMax: 20 } },
  name:       { type: String, rules: { lengthMinMax: [2, 50] } },
  noEmpty:    { type: String, rules: { lengthNot: 0 } },
  email:      { type: String, rules: { isEmail: true } },
  phone:      { type: String, rules: { regex: /^\d{3}-\d{3}-\d{4}$/ } },
  notAdmin:   { type: String, rules: { isNot: 'admin' } }
});

assert('length=10 accepts 10-char string', stringRulesSchema.validate({ code: 'ABCD123456', password: 'pass1234', username: 'john', name: 'Jo', noEmpty: 'x', email: 'a@b.com', phone: '123-456-7890', notAdmin: 'user' }).ok);
assert('length=10 rejects short string', !stringRulesSchema.validate({ code: 'ABC', password: 'pass1234', username: 'john', name: 'Jo', noEmpty: 'x', email: 'a@b.com', phone: '123-456-7890', notAdmin: 'user' }).ok);
assert('lengthMin=8 rejects "pass"', !new Schema({ p: { type: String, rules: { lengthMin: 8 } } }).validate({ p: 'pass' }).ok);
assert('isEmail rejects plaintext', !new Schema({ e: { type: String, rules: { isEmail: true } } }).validate({ e: 'notanemail' }).ok);
assert('isNot=admin rejects "admin"', !new Schema({ u: { type: String, rules: { isNot: 'admin' } } }).validate({ u: 'admin' }).ok);

// Combined string rules
const combinedStrSchema = new Schema({
  username: {
    type: String,
    rules: { lengthMin: 3, lengthMax: 20, regex: /^[a-zA-Z0-9_]+$/, isNot: 'admin' }
  }
});
assert('combined string rules: valid username', combinedStrSchema.validate({ username: 'john_doe' }).ok);
assert('combined string rules: rejects "admin"', !combinedStrSchema.validate({ username: 'admin' }).ok);
assert('combined string rules: rejects special chars', !combinedStrSchema.validate({ username: 'user@domain' }).ok);

// ─── number-rules ───────────────────────────────────────────────────────────

section('number-rules');

const ageSchema2 = new Schema({ age: { type: Number, rules: { min: 18 } } });
assert('min=18 accepts 18', ageSchema2.validate({ age: 18 }).ok);
assert('min=18 rejects 17', !ageSchema2.validate({ age: 17 }).ok);

const pctSchema = new Schema({ pct: { type: Number, rules: { max: 100 } } });
assert('max=100 accepts 100', pctSchema.validate({ pct: 100 }).ok);
assert('max=100 rejects 101', !pctSchema.validate({ pct: 101 }).ok);

const tempSchema = new Schema({ t: { type: Number, rules: { minMax: [-40, 50] } } });
assert('minMax accepts 25', tempSchema.validate({ t: 25 }).ok);
assert('minMax rejects 51', !tempSchema.validate({ t: 51 }).ok);

const magicSchema = new Schema({ n: { type: Number, rules: { is: 42 } } });
assert('is=42 accepts 42', magicSchema.validate({ n: 42 }).ok);
assert('is=42 rejects 41', !magicSchema.validate({ n: 41 }).ok);

const nonZeroSchema = new Schema({ c: { type: Number, rules: { isNot: 0 } } });
assert('isNot=0 accepts 1', nonZeroSchema.validate({ c: 1 }).ok);
assert('isNot=0 rejects 0', !nonZeroSchema.validate({ c: 0 }).ok);

// ─── array-rules ────────────────────────────────────────────────────────────

section('array-rules');

const coordSchema = new Schema({ coordinates: { type: Array, eachType: Number, rules: { length: 2 } } });
assert('array length=2 accepts [10,20]', coordSchema.validate({ coordinates: [10, 20] }).ok);
assert('array length=2 rejects [10]', !coordSchema.validate({ coordinates: [10] }).ok);

const tagsMinSchema = new Schema({ tags: { type: Array, rules: { lengthMin: 1 } } });
assert('array lengthMin=1 rejects []', !tagsMinSchema.validate({ tags: [] }).ok);

const topSchema = new Schema({ top: { type: Array, rules: { lengthMax: 5 } } });
assert('array lengthMax=5 accepts [1,2,3]', topSchema.validate({ top: [1, 2, 3] }).ok);
assert('array lengthMax=5 rejects 6 items', !topSchema.validate({ top: [1, 2, 3, 4, 5, 6] }).ok);

const colorArrSchema = new Schema({ colors: { type: Array, rules: { enum: ['red', 'green', 'blue'] } } });
assert('array enum accepts valid colors', colorArrSchema.validate({ colors: ['red', 'blue'] }).ok);
assert('array enum rejects unknown color', !colorArrSchema.validate({ colors: ['red', 'purple'] }).ok);

// ─── array-validation ───────────────────────────────────────────────────────

section('array-validation');

const numArrSchema = new Schema({ numbers: { type: Array, eachType: Number } });
assert('eachType=Number accepts [1,2,3]', numArrSchema.validate({ numbers: [1, 2, 3] }).ok);
assert('eachType=Number rejects [1,"two",3]', !numArrSchema.validate({ numbers: [1, 'two', 3] }).ok);

const mixedArrSchema = new Schema({ values: { type: Array, eachType: [String, Number] } });
assert('eachType union accepts ["x",1]', mixedArrSchema.validate({ values: ['x', 1] }).ok);
assert('eachType union rejects [true]', !mixedArrSchema.validate({ values: [true] }).ok);

// ─── enum-validation ────────────────────────────────────────────────────────

section('enum-validation');

const statusSchema = new Schema({ status: { type: String, rules: { enum: ['active', 'inactive', 'pending'] } } });
assert('enum accepts "active"', statusSchema.validate({ status: 'active' }).ok);
assert('enum rejects "disabled"', !statusSchema.validate({ status: 'disabled' }).ok);
assert('enum is case-sensitive (rejects "ACTIVE")', !statusSchema.validate({ status: 'ACTIVE' }).ok);

const numEnumSchema = new Schema({ rating: { type: Number, rules: { enum: [1, 2, 3, 4, 5] } } });
assert('number enum accepts 5', numEnumSchema.validate({ rating: 5 }).ok);
assert('number enum rejects 6', !numEnumSchema.validate({ rating: 6 }).ok);

// ─── custom-rules ───────────────────────────────────────────────────────────

section('custom-rules');

const pwSchema = new Schema({
  password: {
    type: String,
    rules: {
      custom: (value: string) => /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)
    }
  }
});
assert('custom rule accepts "Password1"', pwSchema.validate({ password: 'Password1' }).ok);
assert('custom rule rejects "password"', !pwSchema.validate({ password: 'password' }).ok);

// Custom rule with detailed result
const detailedPwSchema = new Schema({
  password: {
    type: String,
    rules: {
      custom: (value: string) => {
        const failed = [
          { cond: /[A-Z]/.test(value), msg: 'uppercase' },
          { cond: /[a-z]/.test(value), msg: 'lowercase' },
          { cond: /\d/.test(value), msg: 'number' }
        ].filter(c => !c.cond);
        return failed.length === 0
          ? true
          : { result: false, details: `Missing: ${failed.map(f => f.msg).join(', ')}` };
      }
    }
  }
});
assert('detailed custom rule accepts "Password1"', detailedPwSchema.validate({ password: 'Password1' }).ok);
assert('detailed custom rule rejects "password" with details', !detailedPwSchema.validate({ password: 'password' }).ok);

// Cross-field custom rule (confirm password)
const confirmSchema = new Schema({
  password: { type: String, rules: { lengthMin: 8 } },
  confirmPassword: {
    type: String,
    rules: {
      custom: (value: string, { input }: { input: any }) => ({
        result: value === input.password,
        details: value === input.password ? '' : 'Passwords do not match'
      })
    }
  }
});
assert('cross-field rule passes when passwords match', confirmSchema.validate({ password: 'Secret123', confirmPassword: 'Secret123' }).ok);
assert('cross-field rule fails when passwords differ', !confirmSchema.validate({ password: 'Secret123', confirmPassword: 'wrong' }).ok);

// Date range cross-field
const dateRangeSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: {
    type: Date,
    required: true,
    rules: {
      custom: (value: Date, { input }: { input: any }) => {
        const end = new Date(value);
        const start = new Date(input.startDate);
        return { result: end >= start, details: end >= start ? '' : 'End date must be after start date' };
      }
    }
  }
});
assert('date range: end > start passes', dateRangeSchema.validate({ startDate: new Date('2024-01-01'), endDate: new Date('2024-12-31') }).ok);
assert('date range: end < start fails', !dateRangeSchema.validate({ startDate: new Date('2024-12-31'), endDate: new Date('2024-01-01') }).ok);

// ─── nested-objects ─────────────────────────────────────────────────────────

section('nested-objects');

const nestedSchema = new Schema({
  user: {
    name: { type: String, required: true, rules: { lengthMin: 2, lengthMax: 50 } },
    email: { type: String, required: true, rules: { isEmail: true } }
  }
});
assert('nested valid object passes', nestedSchema.validate({ user: { name: 'John Doe', email: 'john@example.com' } }).ok);
assert('nested invalid email fails', !nestedSchema.validate({ user: { name: 'John', email: 'bad' } }).ok);

// Deep nesting
const deepSchema = new Schema({
  customer: {
    profile: {
      firstName: { type: String, required: true, rules: { lengthMin: 2 } },
      lastName: { type: String, required: true, rules: { lengthMin: 2 } },
      contact: {
        email: { type: String, required: true, rules: { isEmail: true } }
      }
    }
  }
});
assert('deep nested valid passes', deepSchema.validate({
  customer: { profile: { firstName: 'John', lastName: 'Doe', contact: { email: 'j@d.com' } } }
}).ok);
assert('deep nested invalid email fails', !deepSchema.validate({
  customer: { profile: { firstName: 'John', lastName: 'Doe', contact: { email: 'bad' } } }
}).ok);

// ─── partial-validation ─────────────────────────────────────────────────────

section('partial-validation');

const partialBaseSchema = new Schema({
  name: { type: String, rules: { lengthMin: 2 } },
  email: { type: String, rules: { isEmail: true } },
  phone: { type: String, required: false }
});

const partialData = { name: 'John', email: 'invalid-email', phone: '555-1234' };

assert('partial: validate "name" only passes', partialBaseSchema.validate(partialData, 'name').ok);
assert('partial: validate "email" only fails', !partialBaseSchema.validate(partialData, 'email').ok);
assert('partial: validate ["name","phone"] passes', partialBaseSchema.validate(partialData, ['name', 'phone']).ok);
assert('partial: validate ["name","email"] fails', !partialBaseSchema.validate(partialData, ['name', 'email']).ok);

// ─── custom-messages: inline rule messages ──────────────────────────────────

section('custom-messages — inline rule messages');

const inlineEmailSchema = new Schema({
  email: {
    type: String,
    required: true,
    rules: {
      isEmail: { value: true, message: 'Please enter a valid email address' },
      lengthMinMax: { value: [5, 100], message: 'Email must be between 5 and 100 characters' }
    }
  }
});
const inlineResult = inlineEmailSchema.validate({ email: 'bad' });
assert('inline message on isEmail is returned on failure', !inlineResult.ok && inlineResult.errors.includes('Please enter a valid email address'));

const mixedRuleSchema = new Schema({
  email: {
    type: String,
    rules: {
      isEmail: { value: true, message: 'Invalid email format' },
      lengthMin: 5
    }
  }
});
assert('mixed inline+simple rules: valid passes', mixedRuleSchema.validate({ email: 'user@example.com' }).ok);
assert('mixed inline+simple rules: invalid fails', !mixedRuleSchema.validate({ email: 'bad' }).ok);

// Inline message on number rule
const ageInlineSchema = new Schema({
  age: {
    type: Number,
    required: false,
    rules: { min: { value: 18, message: 'You must be at least 18 years old' } }
  }
});
const ageInlineResult = ageInlineSchema.validate({ age: 10 });
assert('inline message on min rule is returned', !ageInlineResult.ok && ageInlineResult.errors.includes('You must be at least 18 years old'));

// ─── custom-messages: requiredMessage ───────────────────────────────────────

section('custom-messages — requiredMessage');

const reqMsgSchema = new Schema({
  email: { type: String, required: true, requiredMessage: 'Please enter your email address' },
  name: { type: String, required: true, requiredMessage: 'Name is required' }
});
const reqMsgResult = reqMsgSchema.validate({});
assert('requiredMessage shown for missing email', !reqMsgResult.ok && reqMsgResult.errors.includes('Please enter your email address'));
assert('requiredMessage shown for missing name', reqMsgResult.errors.includes('Name is required'));

// ─── custom-messages: customMessage callback ────────────────────────────────

section('custom-messages — customMessage callback');

const callbackSchema = new Schema({
  email: {
    type: String,
    required: true,
    rules: { isEmail: true },
    customMessage: ({ keyword, value, key }: { keyword: string; value: any; key: string }) => {
      if (keyword === 'missing') return 'Email address is required';
      if (keyword === 'isEmail') return `"${value}" is not a valid email address`;
      return `Invalid value for ${key}`;
    }
  }
});
const cbMissingResult = callbackSchema.validate({});
assert('customMessage callback for missing field', !cbMissingResult.ok && cbMissingResult.errors.includes('Email address is required'));
const cbInvalidResult = callbackSchema.validate({ email: 'bad' });
assert('customMessage callback for failed rule', !cbInvalidResult.ok && cbInvalidResult.errors.some((e: string) => e.includes('is not a valid email address')));

// customMessage with switch
const switchCbSchema = new Schema({
  username: {
    type: String,
    title: 'Username',
    rules: { lengthMin: 3, lengthMax: 20 },
    customMessage: ({ keyword, title, rules }: { keyword: string; title?: string; rules?: any }) => {
      switch (keyword) {
        case 'lengthMin': return `${title} must be at least ${rules?.lengthMin} characters long`;
        case 'lengthMax': return `${title} cannot exceed ${rules?.lengthMax} characters`;
        case 'missing': return `${title} is required`;
        default: return `Invalid ${(title ?? '').toLowerCase()}`;
      }
    }
  }
});
assert('customMessage switch: too-short username message', switchCbSchema.validate({ username: 'ab' }).errors.includes('Username must be at least 3 characters long'));

// ─── custom-messages: message priority ─────────────────────────────────────

section('custom-messages — message priority');

// customMessage takes priority over inline rule message
const prioritySchema = new Schema({
  email: {
    type: String,
    rules: { isEmail: { value: true, message: 'Inline message' } },
    customMessage: ({ keyword }: { keyword: string }) => keyword === 'isEmail' ? 'Callback message' : undefined
  }
});
const priorityResult = prioritySchema.validate({ email: 'bad' });
assert('customMessage has priority over inline message', priorityResult.errors.includes('Callback message'));

// ─── summary ────────────────────────────────────────────────────────────────

const passed = checks.filter(c => c.ok).length;
const failed = checks.filter(c => !c.ok).length;
console.log(`\n📝 Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\n⚠️  Attention! There are some failed checks:');
  checks.filter(c => !c.ok).forEach(c => console.log(`— ❌ ${c.label}`));
  process.exit(1);
}
