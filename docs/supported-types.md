# Supported Types

Validno supports a wide range of data types for comprehensive validation scenarios.

## Built-in Types

### String
Validates that the value is a string.

```javascript
const schema = new Schema({
  name: { type: String }
});
```

### Number
Validates that the value is a number (including integers and floats).

```javascript
const schema = new Schema({
  age: { type: Number },
  price: { type: Number }
});
```

### Boolean
Validates that the value is a boolean (`true` or `false`).

```javascript
const schema = new Schema({
  isActive: { type: Boolean }
});
```

### Array
Validates that the value is an array.

```javascript
const schema = new Schema({
  tags: { type: Array },
  items: { type: Array }
});
```

### Object
Validates that the value is an object.

```javascript
const schema = new Schema({
  metadata: { type: Object },
  config: { type: Object }
});
```

### Date
Validates that the value is a Date object.

```javascript
const schema = new Schema({
  createdAt: { type: Date },
  birthday: { type: Date }
});
```

### RegExp
Validates that the value is a regular expression.

```javascript
const schema = new Schema({
  pattern: { type: RegExp }
});
```

### Null
Validates that the value is `null`.

```javascript
const schema = new Schema({
  deletedAt: { type: null }
});
```

## Union Types

You can specify multiple allowed types using an array:

```javascript
const schema = new Schema({
  // Value can be either a string or number
  mixedField: { type: [String, Number] },
  
  // Value can be string, number, or null
  optionalField: { type: [String, Number, null] }
});

// Valid data
const data = {
  mixedField: "hello",  // or 42
  optionalField: null   // or "text" or 123
};
```

## Custom Types

Validate against custom classes or constructor functions:

```javascript
class User {
  constructor(name) {
    this.name = name;
  }
}

const schema = new Schema({
  user: { type: User }
});

// Valid data
const data = {
  user: new User("John")
};
```

## Any Type

Use `'any'` to allow any data type (minimal validation):

```javascript
const schema = new Schema({
  dynamicData: { type: 'any' }
});

// All of these are valid
const validData = [
  { dynamicData: "string" },
  { dynamicData: 42 },
  { dynamicData: [1, 2, 3] },
  { dynamicData: { nested: true } }
];
```

## Complete Example

```javascript
const schema = new Schema({
  // Built-in types
  stringField: { type: String },
  numberField: { type: Number },
  booleanField: { type: Boolean },
  arrayField: { type: Array },
  objectField: { type: Object },
  dateField: { type: Date },
  regexField: { type: RegExp },
  nullField: { type: null },
  
  // Union types
  mixedField: { type: [String, Number] },
  optionalMixed: { type: [String, null] },
  
  // Custom class
  customField: { type: MyCustomClass },
  
  // Any type
  anyField: { type: 'any' }
});
```

## Type Validation Examples

```javascript
const result = schema.validate({
  stringField: "hello",
  numberField: 42,
  booleanField: true,
  arrayField: [1, 2, 3],
  objectField: { key: "value" },
  dateField: new Date(),
  regexField: /pattern/,
  nullField: null,
  mixedField: "can be string",
  optionalMixed: null,
  customField: new MyCustomClass(),
  anyField: "anything goes"
});
```

## Next Steps

- Learn about [Array Validation](/array-validation) for specialized array handling
- Explore [Validation Rules](/string-rules) to add constraints to your types
- See [Custom Rules](/custom-rules) for advanced validation logic