# Schema Definition

## Basic Schema Structure

Every Validno schema follows a consistent structure that defines how your data should be validated:

```javascript
const schema = new Schema({
  fieldName: {
    type: String,           // Required: field type
    required: true,         // Optional: whether field is required (default: true)
    rules: {},             // Optional: validation rules
    title: "Field Name",   // Optional: human-readable field name
    customMessage: (details) => "Custom error" // Optional: custom error function
  }
});
```

## Field Properties

### `type` (Required)
Specifies the expected data type for the field. Can be:
- Built-in JavaScript types: `String`, `Number`, `Boolean`, `Array`, `Object`, `Date`, `RegExp`
- `null` for null values
- Union types: `[String, Number]` for multiple allowed types
- Custom classes: `MyCustomClass`
- `'any'` for any type

### `required` (Optional)
Boolean value indicating whether the field is mandatory. Defaults to `true`.

### `rules` (Optional)
Object containing validation rules specific to the field type. See the validation rules sections for details.

### `title` (Optional)
Human-readable name for the field, used in error messages.

### `customMessage` (Optional)
Function to generate custom error messages. Receives validation details and should return a string.

## Simple Example

```javascript
import Schema from 'validno';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    rules: {
      lengthMin: 1,
      lengthMax: 100
    }
  },
  price: {
    type: Number,
    required: true,
    rules: {
      min: 0
    }
  },
  description: {
    type: String,
    required: false
  },
  inStock: {
    type: Boolean,
    required: true
  }
});

// Validate product data
const product = {
  name: "Laptop",
  price: 999.99,
  description: "High-performance laptop",
  inStock: true
};

const result = productSchema.validate(product);
```

## Next Steps

- Learn about [Supported Types](/supported-types) for detailed type options
- Explore [Array Validation](/array-validation) for working with arrays
- See [Validation Rules](/string-rules) for field-specific validation options