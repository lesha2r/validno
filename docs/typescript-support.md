# TypeScript Support

Validno is built with TypeScript and provides comprehensive type definitions for a fully type-safe validation experience.

## Basic TypeScript Usage

Import Validno with full type support:

```typescript
import Schema, { validations } from 'validno';
import type { 
  SchemaDefinition, 
  FieldSchema, 
  ValidnoResult 
} from 'validno';
```

## Type-Safe Schema Definition

Define schemas with proper TypeScript types:

```typescript
import { SchemaDefinition, FieldSchema } from 'validno';

// Define individual field schemas
const nameField: FieldSchema = {
  type: String,
  required: true,
  rules: {
    lengthMin: 2,
    lengthMax: 50
  }
};

const emailField: FieldSchema = {
  type: String,
  required: true,
  rules: {
    isEmail: true
  }
};

// Define complete schema
const userSchema: SchemaDefinition = {
  name: nameField,
  email: emailField,
  age: {
    type: Number,
    required: false,
    rules: {
      min: 18,
      max: 120
    }
  } as FieldSchema
};

const schema = new Schema(userSchema);
```

## Generic Validation

Use generics to ensure type safety during validation:

```typescript
interface User {
  name: string;
  email: string;
  age?: number;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, rules: { isEmail: true } },
  age: { type: Number, required: false }
});

// Type-safe validation with generic
const userData: User = {
  name: "John Doe",
  email: "john@example.com",
  age: 30
};

const result = userSchema.validate<User>(userData);
//    ^ ValidnoResult type inferred
```

## Partial Validation with Types

TypeScript supports partial validation with proper key constraints:

```typescript
interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registrationSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, rules: { isEmail: true } },
  password: { type: String, rules: { lengthMin: 8 } },
  confirmPassword: { type: String, required: true }
});

// Validate single field with type safety
const emailResult = registrationSchema.validate<UserRegistration, 'email'>(
  userData, 
  'email'
);

// Validate multiple fields with type safety  
const basicResult = registrationSchema.validate<UserRegistration, 'username' | 'email'>(
  userData,
  ['username', 'email']
);
```

## Custom Rule Types

Type-safe custom validation rules:

```typescript
interface ValidationContext {
  schema: SchemaDefinition;
  input: any;
}

interface CustomRuleResult {
  result: boolean;
  details: string;
}

const passwordSchema = new Schema({
  password: {
    type: String,
    required: true,
    rules: {
      custom: (value: string, context: ValidationContext): boolean | CustomRuleResult => {
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecial = /[!@#$%^&*]/.test(value);
        
        const isValid = hasUpper && hasLower && hasNumber && hasSpecial;
        
        return {
          result: isValid,
          details: isValid ? '' : 'Password must contain uppercase, lowercase, number, and special character'
        };
      }
    }
  }
});
```

## Custom Message Types

Type-safe custom message functions:

```typescript
interface MessageContext {
  keyword: string;
  value: any;
  key: string;
  title?: string;
  reqs: FieldSchema;
  schema: SchemaDefinition;
  rules: ValidationRules;
}

const typedSchema = new Schema({
  username: {
    type: String,
    title: "Username",
    rules: {
      lengthMin: 3,
      lengthMax: 20
    },
    customMessage: (context: MessageContext): string => {
      const { keyword, title, rules } = context;
      
      switch (keyword) {
        case 'lengthMin':
          return `${title} must be at least ${rules.lengthMin} characters`;
        case 'lengthMax':
          return `${title} cannot exceed ${rules.lengthMax} characters`;
        default:
          return `Invalid ${title?.toLowerCase() || 'value'}`;
      }
    }
  }
});
```

## Advanced Generic Usage

### Strongly Typed Schema Factory

```typescript
function createTypedSchema<T>() {
  return {
    define: (definition: SchemaDefinition) => new Schema(definition),
    validate: (schema: Schema, data: T, keys?: keyof T | (keyof T)[]): ValidnoResult => {
      return schema.validate(data, keys as string | string[]);
    }
  };
}

// Usage
interface Product {
  name: string;
  price: number;
  category: string;
}

const productSchemaFactory = createTypedSchema<Product>();

const productSchema = productSchemaFactory.define({
  name: { type: String, required: true },
  price: { type: Number, rules: { min: 0 } },
  category: { type: String, rules: { enum: ['electronics', 'clothing'] } }
});

const result = productSchemaFactory.validate(
  productSchema,
  productData,
  ['name', 'price'] // Type-safe keys
);
```

### Schema Builder Pattern

```typescript
class TypedSchemaBuilder<T> {
  private definition: Partial<SchemaDefinition> = {};
  
  field<K extends keyof T>(
    key: K, 
    fieldDef: FieldSchema
  ): TypedSchemaBuilder<T> {
    this.definition[key as string] = fieldDef;
    return this;
  }
  
  build(): Schema {
    return new Schema(this.definition as SchemaDefinition);
  }
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

const userSchema = new TypedSchemaBuilder<User>()
  .field('id', { 
    type: Number, 
    required: true, 
    rules: { min: 1 } 
  })
  .field('name', { 
    type: String, 
    required: true, 
    rules: { lengthMin: 2 } 
  })
  .field('email', { 
    type: String, 
    required: true, 
    rules: { isEmail: true } 
  })
  .build();
```

## Union Types in Validation

Handle union types properly:

```typescript
type StringOrNumber = string | number;
type OptionalField = string | null | undefined;

interface FlexibleData {
  id: StringOrNumber;
  name: string;
  description?: OptionalField;
}

const flexibleSchema = new Schema({
  id: {
    type: [String, Number], // Union type
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: [String, null],
    required: false
  }
});

const data: FlexibleData = {
  id: "123", // or 123
  name: "Product",
  description: null // or "Some description" or undefined
};
```

## Enum Types Integration

Integrate TypeScript enums with validation:

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

enum Priority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

interface Task {
  title: string;
  assignedTo: UserRole;
  priority: Priority;
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: true,
    rules: {
      enum: Object.values(UserRole)
    }
  },
  priority: {
    type: Number,
    required: true,
    rules: {
      enum: Object.values(Priority)
    }
  }
});

const task: Task = {
  title: "Complete documentation",
  assignedTo: UserRole.USER,
  priority: Priority.HIGH
};

const result = taskSchema.validate<Task>(task);
```

## Utility Types

Create utility types for common patterns:

```typescript
// Extract field names that are required
type RequiredFields<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T];

// Extract field names that are optional
type OptionalFields<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T];

// Create validation key sets
type ValidationKeys<T> = keyof T | (keyof T)[];

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

type UserRequiredFields = RequiredFields<User>; // 'id' | 'name' | 'email'
type UserOptionalFields = OptionalFields<User>; // 'phone' | 'bio'
```

## Error Handling with Types

Type-safe error handling:

```typescript
interface TypedValidationResult<T> extends ValidnoResult {
  validate<K extends keyof T>(keys?: K | K[]): this;
  getFieldError<K extends keyof T>(field: K): string | null;
  hasFieldError<K extends keyof T>(field: K): boolean;
}

class TypedResultWrapper<T> implements TypedValidationResult<T> {
  constructor(private result: ValidnoResult) {}
  
  // Implement ValidnoResult interface
  get ok() { return this.result.ok; }
  get passed() { return this.result.passed; }
  get failed() { return this.result.failed; }
  get missed() { return this.result.missed; }
  get errors() { return this.result.errors; }
  get byKeys() { return this.result.byKeys; }
  get errorsByKeys() { return this.result.errorsByKeys; }
  joinErrors(separator?: string) { return this.result.joinErrors(separator); }
  
  // Type-safe extensions
  getFieldError<K extends keyof T>(field: K): string | null {
    const fieldName = field as string;
    return this.result.errorsByKeys[fieldName]?.[0] || null;
  }
  
  hasFieldError<K extends keyof T>(field: K): boolean {
    const fieldName = field as string;
    return this.result.byKeys[fieldName] === false;
  }
  
  validate<K extends keyof T>(keys?: K | K[]): this {
    // Implementation would require access to original schema and data
    return this;
  }
}

// Usage
const result = new TypedResultWrapper<User>(userSchema.validate(userData));
const nameError = result.getFieldError('name'); // Type-safe field access
const hasEmailError = result.hasFieldError('email'); // Type-safe boolean check
```

## Integration with Popular Libraries

### Zod-style Schema Definition

For developers familiar with Zod, create a similar interface:

```typescript
class ValidnoBuilder {
  static string() {
    return new StringValidator();
  }
  
  static number() {
    return new NumberValidator();
  }
  
  static object<T>(shape: { [K in keyof T]: FieldValidator<T[K]> }) {
    const definition: SchemaDefinition = {};
    
    for (const [key, validator] of Object.entries(shape)) {
      definition[key] = validator.toFieldSchema();
    }
    
    return new Schema(definition);
  }
}

class StringValidator implements FieldValidator<string> {
  private fieldSchema: FieldSchema = { type: String };
  
  min(length: number) {
    this.fieldSchema.rules = { ...this.fieldSchema.rules, lengthMin: length };
    return this;
  }
  
  max(length: number) {
    this.fieldSchema.rules = { ...this.fieldSchema.rules, lengthMax: length };
    return this;
  }
  
  email() {
    this.fieldSchema.rules = { ...this.fieldSchema.rules, isEmail: true };
    return this;
  }
  
  toFieldSchema(): FieldSchema {
    return this.fieldSchema;
  }
}

interface FieldValidator<T> {
  toFieldSchema(): FieldSchema;
}

// Usage similar to Zod
const userSchema = ValidnoBuilder.object({
  name: ValidnoBuilder.string().min(2).max(50),
  email: ValidnoBuilder.string().email(),
  age: ValidnoBuilder.number().min(18)
});
```

## Best Practices

1. **Always use generics** for type-safe validation
2. **Define interfaces** for your data structures
3. **Use utility types** for complex type manipulations
4. **Leverage enum integration** for controlled vocabularies
5. **Create wrapper classes** for enhanced type safety
6. **Use strict TypeScript settings** for better error catching

## Configuration

### TypeScript Compiler Options

Recommended `tsconfig.json` settings for optimal Validno usage:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Next Steps

- Explore [Built-in Utilities](/built-in-utilities) with TypeScript types
- See [Advanced Examples](/advanced-examples) for complex TypeScript patterns
- Learn about integration with popular TypeScript frameworks