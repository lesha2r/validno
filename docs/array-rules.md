# Array Rules

Array validation rules allow you to control the structure and content of arrays beyond just type checking.

## Length Validation

### Exact Length
Require an array to have a specific number of elements:

```javascript
const schema = new Schema({
  coordinates: {
    type: Array,
    eachType: Number,
    rules: {
      length: 2 // Must have exactly 2 elements [x, y]
    }
  }
});

// Valid: [10, 20], [-5.5, 15.3]
// Invalid: [10], [10, 20, 30]
```

### Minimum Length
Set a minimum number of elements:

```javascript
const schema = new Schema({
  tags: {
    type: Array,
    rules: {
      lengthMin: 1 // Must have at least 1 element
    }
  }
});

// Valid: ["tag1"], ["tag1", "tag2", "tag3"]
// Invalid: []
```

### Maximum Length
Set a maximum number of elements:

```javascript
const schema = new Schema({
  topItems: {
    type: Array,
    rules: {
      lengthMax: 5 // Must have 5 elements or fewer
    }
  }
});

// Valid: [], [1], [1, 2, 3, 4, 5]
// Invalid: [1, 2, 3, 4, 5, 6]
```

### Length Range
Combine minimum and maximum in a single rule:

```javascript
const schema = new Schema({
  choices: {
    type: Array,
    rules: {
      lengthMinMax: [2, 10] // Between 2 and 10 elements
    }
  }
});

// Valid: [1, 2], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// Invalid: [1], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
```

## Content Validation

### Enum Validation
Ensure all array elements are from a predefined set of values:

```javascript
const schema = new Schema({
  colors: {
    type: Array,
    rules: {
      enum: ['red', 'green', 'blue', 'yellow'] // All items must be from this list
    }
  }
});

// Valid: ['red'], ['red', 'blue'], ['green', 'yellow', 'red']
// Invalid: ['purple'], ['red', 'orange'], ['blue', 'unknown']
```

## Combining Rules

### Array with Type and Length Constraints
```javascript
const schema = new Schema({
  scores: {
    type: Array,
    eachType: Number,     // Each element must be a number
    rules: {
      lengthMin: 3,       // At least 3 scores
      lengthMax: 10       // At most 10 scores
    }
  }
});

// Valid: [85, 90, 95], [70, 80, 90, 85, 95]
// Invalid: [85, 90] (too few), [85, "90", 95] (wrong type)
```

### Enum with Length Constraints
```javascript
const schema = new Schema({
  selectedOptions: {
    type: Array,
    rules: {
      enum: ['option1', 'option2', 'option3', 'option4'],
      lengthMin: 1,       // At least one option
      lengthMax: 3        // At most three options
    }
  }
});

// Valid: ['option1'], ['option1', 'option2']
// Invalid: [], ['option1', 'option2', 'option3', 'option4']
```

## Common Use Cases

### RGB Color Values
```javascript
const rgbSchema = new Schema({
  rgb: {
    type: Array,
    eachType: Number,
    rules: {
      length: 3 // Exactly 3 values for R, G, B
    }
  }
});

// Valid: [255, 128, 0], [0, 0, 0]
// Invalid: [255, 128], [255, 128, 0, 128]
```

### Multiple Choice Selection
```javascript
const multipleChoiceSchema = new Schema({
  answers: {
    type: Array,
    rules: {
      enum: ['A', 'B', 'C', 'D'],
      lengthMin: 1,        // Must select at least one
      lengthMax: 2         // Can select at most two
    }
  }
});

// Valid: ['A'], ['A', 'B']
// Invalid: [], ['A', 'B', 'C']
```

### Tag System
```javascript
const tagSchema = new Schema({
  tags: {
    type: Array,
    eachType: String,
    rules: {
      lengthMin: 1,        // At least one tag
      lengthMax: 5         // Maximum 5 tags
    }
  }
});

// Valid: ['javascript'], ['javascript', 'web', 'frontend']
// Invalid: [], ['js', 'web', 'frontend', 'react', 'vue', 'angular']
```

### Permission Lists
```javascript
const permissionSchema = new Schema({
  permissions: {
    type: Array,
    rules: {
      enum: ['read', 'write', 'delete', 'admin'],
      lengthMin: 1         // Must have at least one permission
    }
  }
});

// Valid: ['read'], ['read', 'write'], ['read', 'write', 'delete']
// Invalid: [], ['read', 'invalid_permission']
```

## Complex Example: Survey Response

```javascript
const surveySchema = new Schema({
  // Single choice question
  difficulty: {
    type: Array,
    rules: {
      enum: ['easy', 'medium', 'hard'],
      length: 1           // Exactly one choice
    }
  },
  
  // Multiple choice question
  features: {
    type: Array,
    rules: {
      enum: ['ui', 'performance', 'security', 'documentation', 'support'],
      lengthMin: 1,       // At least one feature
      lengthMax: 3        // At most three features
    }
  },
  
  // Rating scales (1-5 for multiple criteria)
  ratings: {
    type: Array,
    eachType: Number,
    rules: {
      length: 4           // Exactly 4 ratings required
    }
  },
  
  // Optional additional tags
  additionalTags: {
    type: Array,
    eachType: String,
    required: false,
    rules: {
      lengthMax: 10       // Optional, but max 10 if provided
    }
  }
});

// Example valid data
const surveyResponse = {
  difficulty: ['medium'],
  features: ['ui', 'performance'],
  ratings: [4, 5, 3, 4],
  additionalTags: ['helpful', 'intuitive']
};

const result = surveySchema.validate(surveyResponse);
```

## Best Practices

1. **Combine with `eachType`** when you need to validate both array structure and element types
2. **Use `enum` for controlled vocabularies** like status values, categories, or options
3. **Set reasonable length limits** to prevent abuse and ensure data quality
4. **Consider optional arrays** for fields that might not be provided

## Error Examples

```javascript
const schema = new Schema({
  items: {
    type: Array,
    rules: {
      lengthMin: 2,
      lengthMax: 5,
      enum: ['a', 'b', 'c']
    }
  }
});

// Various invalid scenarios:
const tests = [
  { items: [] },              // Fails: too short (lengthMin: 2)
  { items: ['a'] },           // Fails: too short (lengthMin: 2)  
  { items: ['a','b','c','a','b','c'] }, // Fails: too long (lengthMax: 5)
  { items: ['a', 'x'] },      // Fails: 'x' not in enum
  { items: ['a', 'b'] }       // Valid: correct length and all in enum
];
```

## Next Steps

- Learn about [Custom Rules](/custom-rules) for advanced array validation logic
- Explore [Nested Objects](/nested-objects) for validating arrays containing objects
- See [Validation Results](/validation-results) to understand validation outcomes