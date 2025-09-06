# Array Validation

Arrays require special handling in validation scenarios. Validno provides flexible options for validating arrays and their contents.

## Basic Array Validation

The simplest array validation just checks that the value is an array:

```javascript
const schema = new Schema({
  items: { type: Array }
});

// Valid
const data = {
  items: [1, 2, "three", { four: 4 }] // Any array content is valid
};
```

## Array Element Type Validation

Use `eachType` to validate that each element in the array matches a specific type:

```javascript
const schema = new Schema({
  // Array where each item must be a number
  numbers: { 
    type: Array, 
    eachType: Number 
  },
  
  // Array where each item must be a string
  names: { 
    type: Array, 
    eachType: String 
  },
  
  // Array where each item must be an object
  users: { 
    type: Array, 
    eachType: Object 
  }
});

// Valid data
const data = {
  numbers: [1, 2, 3, 4, 5],
  names: ["Alice", "Bob", "Charlie"],
  users: [
    { name: "Alice" },
    { name: "Bob" }
  ]
};

// Invalid data
const invalidData = {
  numbers: [1, 2, "three"], // "three" is not a number
  names: ["Alice", 42],      // 42 is not a string
  users: ["Alice", "Bob"]    // strings are not objects
};
```

## Union Types in Arrays

You can also use union types with `eachType`:

```javascript
const schema = new Schema({
  mixedNumbers: {
    type: Array,
    eachType: [String, Number] // Each item can be string OR number
  }
});

// Valid data
const data = {
  mixedNumbers: [1, "2", 3, "four", 5.5]
};
```

## Array Rules

Arrays support length-based validation rules:

```javascript
const schema = new Schema({
  tags: {
    type: Array,
    rules: {
      length: 5,              // Exact length
      lengthMin: 1,          // Minimum length
      lengthMax: 10,         // Maximum length
      lengthMinMax: [1, 10], // Length range
      enum: ['red', 'green', 'blue'] // All items must be from this list
    }
  }
});
```

### Array Rule Examples

```javascript
// Exact length
const exactSchema = new Schema({
  coordinates: {
    type: Array,
    eachType: Number,
    rules: { length: 2 } // Must have exactly 2 numbers
  }
});

// Length range
const rangeSchema = new Schema({
  items: {
    type: Array,
    rules: { 
      lengthMin: 1,   // At least 1 item
      lengthMax: 100  // At most 100 items
    }
  }
});

// Enum validation - all items must be from the allowed list
const enumSchema = new Schema({
  colors: {
    type: Array,
    rules: {
      enum: ['red', 'green', 'blue', 'yellow']
    }
  }
});

// Valid data for enum
const colorData = {
  colors: ['red', 'blue', 'green'] // All items are in the enum list
};

// Invalid data for enum
const invalidColorData = {
  colors: ['red', 'purple'] // 'purple' is not in the enum list
};
```

## Complex Array Examples

### Array of Objects with Validation

```javascript
const schema = new Schema({
  users: {
    type: Array,
    eachType: Object,
    rules: {
      lengthMin: 1 // At least one user required
    }
  },
  // Note: For nested object validation within arrays, 
  // you would typically validate the array first, 
  // then validate each object separately
});
```

### Mixed Content Arrays

```javascript
const schema = new Schema({
  // Array that can contain strings, numbers, or null
  mixedData: {
    type: Array,
    eachType: [String, Number, null],
    rules: {
      lengthMin: 1,
      lengthMax: 50
    }
  }
});

// Valid data
const data = {
  mixedData: ["hello", 42, null, "world", 3.14]
};
```

### Combining Array and Element Validation

```javascript
const schema = new Schema({
  scores: {
    type: Array,
    eachType: Number,
    rules: {
      lengthMinMax: [1, 10] // 1-10 numbers required
    }
  }
});

// Each number in the array could have additional validation
// if you need to validate the values themselves (e.g., score range),
// you would typically do that in a separate validation step
```

## Best Practices

1. **Use `eachType`** when you need to validate the type of array elements
2. **Combine with rules** to set array length constraints
3. **Use enum rules** when array items should be from a predefined set
4. **For complex nested validation**, consider validating the array structure first, then validating nested objects in a separate step

## Next Steps

- Learn about [String Rules](/string-rules) for validating string values
- Explore [Custom Rules](/custom-rules) for advanced array validation logic
- See [Nested Objects](/nested-objects) for handling complex data structures