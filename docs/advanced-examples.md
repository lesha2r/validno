# Advanced Examples

Complex validation scenarios and advanced patterns using Validno for sophisticated applications.

## Multi-Step Form Wizard

A complex wizard form with conditional validation:

```javascript
import Schema from 'validno';

class FormWizard {
  constructor() {
    this.steps = {
      personal: new Schema({
        firstName: {
          type: String,
          required: true,
          rules: { lengthMin: 2, lengthMax: 50 }
        },
        lastName: {
          type: String,
          required: true,
          rules: { lengthMin: 2, lengthMax: 50 }
        },
        birthDate: {
          type: Date,
          required: true,
          rules: {
            custom: (value) => {
              const age = this.calculateAge(new Date(value));
              return {
                result: age >= 18 && age <= 100,
                details: age < 18 ? 'Must be 18 or older' : age > 100 ? 'Invalid birth date' : ''
              };
            }
          }
        },
        gender: {
          type: String,
          required: false,
          rules: { enum: ['male', 'female', 'other', 'prefer-not-to-say'] }
        }
      }),

      contact: new Schema({
        email: {
          type: String,
          required: true,
          rules: { isEmail: true }
        },
        phone: {
          type: String,
          required: true,
          rules: {
            regex: /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/
          }
        },
        address: {
          street: {
            type: String,
            required: true,
            rules: { lengthMin: 5, lengthMax: 100 }
          },
          city: {
            type: String,
            required: true,
            rules: { lengthMin: 2, lengthMax: 50 }
          },
          state: {
            type: String,
            required: true,
            rules: { length: 2, regex: /^[A-Z]{2}$/ }
          },
          zipCode: {
            type: String,
            required: true,
            rules: { regex: /^\d{5}(-\d{4})?$/ }
          },
          country: {
            type: String,
            required: true,
            rules: { enum: ['US', 'CA', 'MX'] }
          }
        }
      }),

      professional: new Schema({
        employmentStatus: {
          type: String,
          required: true,
          rules: { enum: ['employed', 'unemployed', 'student', 'retired', 'self-employed'] }
        },
        company: {
          type: String,
          required: false, // Will be required conditionally
          rules: { lengthMax: 100 }
        },
        jobTitle: {
          type: String,
          required: false, // Will be required conditionally
          rules: { lengthMax: 100 }
        },
        annualIncome: {
          type: Number,
          required: false,
          rules: { min: 0, max: 10000000 }
        },
        education: {
          type: String,
          required: true,
          rules: {
            enum: [
              'high-school',
              'associates',
              'bachelors',
              'masters',
              'doctorate',
              'other'
            ]
          }
        }
      }),

      preferences: new Schema({
        newsletter: {
          type: Boolean,
          required: false
        },
        communicationMethods: {
          type: Array,
          eachType: String,
          required: true,
          rules: {
            enum: ['email', 'phone', 'sms', 'mail'],
            lengthMin: 1
          }
        },
        interests: {
          type: Array,
          eachType: String,
          required: false,
          rules: {
            enum: [
              'technology',
              'finance',
              'health',
              'travel',
              'education',
              'entertainment',
              'sports',
              'food'
            ],
            lengthMax: 5
          }
        },
        language: {
          type: String,
          required: true,
          rules: { enum: ['en', 'es', 'fr'] }
        }
      })
    };
  }

  calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  validateStep(stepName, data) {
    const schema = this.steps[stepName];
    if (!schema) {
      throw new Error(`Unknown step: ${stepName}`);
    }

    // Apply conditional validation
    if (stepName === 'professional') {
      return this.validateProfessionalStep(data);
    }

    return schema.validate(data);
  }

  validateProfessionalStep(data) {
    const { employmentStatus } = data;
    
    // Create dynamic schema based on employment status
    const dynamicRules = { ...this.steps.professional.definition };
    
    if (employmentStatus === 'employed' || employmentStatus === 'self-employed') {
      // Company and job title are required for employed people
      dynamicRules.company.required = true;
      dynamicRules.jobTitle.required = true;
    }

    const dynamicSchema = new Schema(dynamicRules);
    return dynamicSchema.validate(data);
  }

  validateAllSteps(allData) {
    const results = {};
    let allValid = true;

    for (const [stepName, stepData] of Object.entries(allData)) {
      const result = this.validateStep(stepName, stepData);
      results[stepName] = result;
      
      if (!result.ok) {
        allValid = false;
      }
    }

    return {
      valid: allValid,
      stepResults: results,
      summary: this.generateSummary(results)
    };
  }

  generateSummary(results) {
    const summary = {
      totalSteps: Object.keys(results).length,
      validSteps: 0,
      invalidSteps: 0,
      totalErrors: 0,
      errorsByStep: {}
    };

    for (const [stepName, result] of Object.entries(results)) {
      if (result.ok) {
        summary.validSteps++;
      } else {
        summary.invalidSteps++;
        summary.totalErrors += result.errors.length;
        summary.errorsByStep[stepName] = result.errors;
      }
    }

    return summary;
  }
}

// Usage
const wizard = new FormWizard();

const formData = {
  personal: {
    firstName: "John",
    lastName: "Doe",
    birthDate: new Date('1985-06-15'),
    gender: "male"
  },
  contact: {
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US"
    }
  },
  professional: {
    employmentStatus: "employed",
    company: "Tech Corp",
    jobTitle: "Software Developer",
    annualIncome: 75000,
    education: "bachelors"
  },
  preferences: {
    newsletter: true,
    communicationMethods: ["email", "phone"],
    interests: ["technology", "education"],
    language: "en"
  }
};

// Validate individual step
const step1Result = wizard.validateStep('personal', formData.personal);

// Validate all steps
const fullResult = wizard.validateAllSteps(formData);
```

## Dynamic Schema Generation

Create schemas dynamically based on configuration:

```javascript
class DynamicSchemaBuilder {
  constructor() {
    this.fieldTemplates = {
      string: {
        type: String,
        required: true,
        rules: {}
      },
      email: {
        type: String,
        required: true,
        rules: { isEmail: true }
      },
      number: {
        type: Number,
        required: true,
        rules: {}
      },
      select: {
        type: String,
        required: true,
        rules: { enum: [] }
      },
      multiSelect: {
        type: Array,
        eachType: String,
        required: true,
        rules: { enum: [] }
      },
      boolean: {
        type: Boolean,
        required: true
      },
      date: {
        type: Date,
        required: true,
        rules: {}
      }
    };
  }

  buildFromConfig(config) {
    const definition = {};

    for (const field of config.fields) {
      definition[field.name] = this.buildField(field);
    }

    return new Schema(definition);
  }

  buildField(fieldConfig) {
    const template = this.fieldTemplates[fieldConfig.type];
    if (!template) {
      throw new Error(`Unknown field type: ${fieldConfig.type}`);
    }

    const field = JSON.parse(JSON.stringify(template)); // Deep clone

    // Apply field-specific configuration
    field.required = fieldConfig.required !== false;
    field.title = fieldConfig.label || fieldConfig.name;

    // Apply validation rules
    if (fieldConfig.validation) {
      this.applyValidationRules(field, fieldConfig.validation);
    }

    // Apply custom message
    if (fieldConfig.customMessage) {
      field.customMessage = this.createCustomMessage(fieldConfig.customMessage);
    }

    return field;
  }

  applyValidationRules(field, validation) {
    const rules = field.rules;

    // String validations
    if (validation.minLength) rules.lengthMin = validation.minLength;
    if (validation.maxLength) rules.lengthMax = validation.maxLength;
    if (validation.pattern) rules.regex = new RegExp(validation.pattern);

    // Number validations
    if (validation.min !== undefined) rules.min = validation.min;
    if (validation.max !== undefined) rules.max = validation.max;

    // Array/Select validations
    if (validation.options) rules.enum = validation.options;
    if (validation.minItems) rules.lengthMin = validation.minItems;
    if (validation.maxItems) rules.lengthMax = validation.maxItems;

    // Custom validation
    if (validation.custom) {
      rules.custom = this.createCustomRule(validation.custom);
    }
  }

  createCustomRule(customConfig) {
    return (value, context) => {
      // This could be expanded to support various custom rule types
      if (customConfig.type === 'unique') {
        // Example: check uniqueness against existing values
        const existingValues = customConfig.existingValues || [];
        return {
          result: !existingValues.includes(value),
          details: !existingValues.includes(value) ? '' : customConfig.message || 'Value must be unique'
        };
      }

      if (customConfig.type === 'conditional') {
        // Example: conditional validation based on other fields
        const condition = customConfig.condition;
        const dependentField = condition.field;
        const dependentValue = context.input[dependentField];

        if (dependentValue === condition.value) {
          // Apply conditional validation
          if (condition.required && !value) {
            return {
              result: false,
              details: customConfig.message || 'This field is required'
            };
          }
        }

        return true;
      }

      return true;
    };
  }

  createCustomMessage(messageConfig) {
    return ({ keyword, value, title, rules }) => {
      const messages = messageConfig.messages || {};
      
      if (messages[keyword]) {
        return messages[keyword]
          .replace('{title}', title)
          .replace('{value}', value)
          .replace('{min}', rules.lengthMin || rules.min)
          .replace('{max}', rules.lengthMax || rules.max);
      }

      return `Invalid ${title || 'value'}`;
    };
  }
}

// Configuration-driven form
const formConfig = {
  name: "User Registration Form",
  fields: [
    {
      name: "username",
      type: "string",
      label: "Username",
      required: true,
      validation: {
        minLength: 3,
        maxLength: 20,
        pattern: "^[a-zA-Z0-9_]+$",
        custom: {
          type: "unique",
          existingValues: ["admin", "root", "test"],
          message: "Username is already taken"
        }
      },
      customMessage: {
        messages: {
          lengthMin: "{title} must be at least {min} characters",
          lengthMax: "{title} cannot exceed {max} characters",
          regex: "{title} can only contain letters, numbers, and underscores"
        }
      }
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      required: true
    },
    {
      name: "age",
      type: "number",
      label: "Age",
      required: true,
      validation: {
        min: 13,
        max: 120
      }
    },
    {
      name: "country",
      type: "select",
      label: "Country",
      required: true,
      validation: {
        options: ["US", "CA", "UK", "AU", "DE", "FR"]
      }
    },
    {
      name: "interests",
      type: "multiSelect",
      label: "Interests",
      required: false,
      validation: {
        options: ["technology", "sports", "music", "travel", "food"],
        maxItems: 3
      }
    },
    {
      name: "newsletter",
      type: "boolean",
      label: "Subscribe to Newsletter",
      required: false
    },
    {
      name: "emergencyContact",
      type: "string",
      label: "Emergency Contact",
      required: false,
      validation: {
        custom: {
          type: "conditional",
          condition: {
            field: "age",
            value: 18,
            operator: "<",
            required: true
          },
          message: "Emergency contact is required for minors"
        }
      }
    }
  ]
};

// Build and use the schema
const builder = new DynamicSchemaBuilder();
const dynamicSchema = builder.buildFromConfig(formConfig);

const userData = {
  username: "john_doe",
  email: "john@example.com",
  age: 25,
  country: "US",
  interests: ["technology", "travel"],
  newsletter: true,
  emergencyContact: ""
};

const result = dynamicSchema.validate(userData);
```

## Database Entity Validation

Complex validation for database entities with relationships:

```javascript
class EntityValidator {
  constructor(database) {
    this.db = database;
    this.setupSchemas();
  }

  setupSchemas() {
    // User entity schema
    this.userSchema = new Schema({
      id: {
        type: Number,
        required: false, // Not required for creation
        rules: {
          custom: async (value) => {
            if (!value) return true; // Skip for new entities
            
            const exists = await this.db.users.exists(value);
            return {
              result: exists,
              details: exists ? '' : 'User ID does not exist'
            };
          }
        }
      },

      username: {
        type: String,
        required: true,
        rules: {
          lengthMin: 3,
          lengthMax: 50,
          regex: /^[a-zA-Z0-9_]+$/,
          custom: async (value, { input }) => {
            const existing = await this.db.users.findByUsername(value);
            if (existing && existing.id !== input.id) {
              return {
                result: false,
                details: 'Username is already taken'
              };
            }
            return true;
          }
        }
      },

      email: {
        type: String,
        required: true,
        rules: {
          isEmail: true,
          custom: async (value, { input }) => {
            const existing = await this.db.users.findByEmail(value);
            if (existing && existing.id !== input.id) {
              return {
                result: false,
                details: 'Email is already registered'
              };
            }
            return true;
          }
        }
      },

      roleId: {
        type: Number,
        required: true,
        rules: {
          custom: async (value) => {
            const role = await this.db.roles.findById(value);
            return {
              result: !!role,
              details: role ? '' : 'Invalid role ID'
            };
          }
        }
      },

      departmentId: {
        type: Number,
        required: false,
        rules: {
          custom: async (value) => {
            if (!value) return true;
            
            const department = await this.db.departments.findById(value);
            return {
              result: !!department,
              details: department ? '' : 'Invalid department ID'
            };
          }
        }
      }
    });

    // Order entity schema with complex business rules
    this.orderSchema = new Schema({
      customerId: {
        type: Number,
        required: true,
        rules: {
          custom: async (value) => {
            const customer = await this.db.customers.findById(value);
            if (!customer) {
              return {
                result: false,
                details: 'Customer not found'
              };
            }

            if (customer.status === 'suspended') {
              return {
                result: false,
                details: 'Cannot create order for suspended customer'
              };
            }

            return true;
          }
        }
      },

      items: {
        type: Array,
        eachType: Object,
        required: true,
        rules: {
          lengthMin: 1,
          custom: async (items) => {
            // Validate each item
            for (const item of items) {
              const product = await this.db.products.findById(item.productId);
              
              if (!product) {
                return {
                  result: false,
                  details: `Product ${item.productId} not found`
                };
              }

              if (product.stock < item.quantity) {
                return {
                  result: false,
                  details: `Insufficient stock for product ${product.name}`
                };
              }

              if (item.quantity <= 0) {
                return {
                  result: false,
                  details: 'Item quantity must be positive'
                };
              }
            }

            return true;
          }
        }
      },

      shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
      },

      paymentMethod: {
        type: String,
        required: true,
        rules: {
          enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer']
        }
      },

      discountCode: {
        type: String,
        required: false,
        rules: {
          custom: async (value, { input }) => {
            if (!value) return true;

            const discount = await this.db.discounts.findByCode(value);
            
            if (!discount) {
              return {
                result: false,
                details: 'Invalid discount code'
              };
            }

            if (discount.expiresAt < new Date()) {
              return {
                result: false,
                details: 'Discount code has expired'
              };
            }

            if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
              return {
                result: false,
                details: 'Discount code usage limit exceeded'
              };
            }

            // Check minimum order amount
            const orderTotal = this.calculateOrderTotal(input.items);
            if (discount.minimumAmount && orderTotal < discount.minimumAmount) {
              return {
                result: false,
                details: `Minimum order amount of $${discount.minimumAmount} required for this discount`
              };
            }

            return true;
          }
        }
      }
    });
  }

  calculateOrderTotal(items) {
    // This would calculate the total from items
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  async validateUser(userData, isUpdate = false) {
    // For updates, make ID optional but validate existing user
    if (isUpdate) {
      const modifiedSchema = { ...this.userSchema.definition };
      modifiedSchema.id.required = true;
      const updateSchema = new Schema(modifiedSchema);
      return await updateSchema.validate(userData);
    }

    return await this.userSchema.validate(userData);
  }

  async validateOrder(orderData) {
    return await this.orderSchema.validate(orderData);
  }

  async validateBulkUsers(userDataArray) {
    const results = [];
    const errors = [];

    for (let i = 0; i < userDataArray.length; i++) {
      const userData = userDataArray[i];
      
      try {
        const result = await this.validateUser(userData);
        results.push({
          index: i,
          data: userData,
          valid: result.ok,
          errors: result.errors
        });

        if (!result.ok) {
          errors.push(`Row ${i + 1}: ${result.joinErrors(', ')}`);
        }
      } catch (error) {
        results.push({
          index: i,
          data: userData,
          valid: false,
          errors: [error.message]
        });
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return {
      valid: errors.length === 0,
      results,
      summary: {
        total: userDataArray.length,
        valid: results.filter(r => r.valid).length,
        invalid: results.filter(r => !r.valid).length
      },
      errors
    };
  }
}

// Usage with a database abstraction
const mockDb = {
  users: {
    exists: async (id) => id < 1000,
    findByUsername: async (username) => username === 'admin' ? { id: 1 } : null,
    findByEmail: async (email) => email === 'admin@example.com' ? { id: 1 } : null
  },
  roles: {
    findById: async (id) => [1, 2, 3].includes(id) ? { id, name: 'Role' } : null
  },
  departments: {
    findById: async (id) => [1, 2, 3, 4].includes(id) ? { id, name: 'Dept' } : null
  },
  customers: {
    findById: async (id) => ({ id, status: 'active' })
  },
  products: {
    findById: async (id) => ({ id, name: 'Product', stock: 100, price: 10.00 })
  },
  discounts: {
    findByCode: async (code) => code === 'SAVE10' ? {
      code,
      percentage: 10,
      expiresAt: new Date(Date.now() + 86400000),
      usageLimit: 100,
      usageCount: 50,
      minimumAmount: 50
    } : null
  }
};

const validator = new EntityValidator(mockDb);

// Validate single user
const userData = {
  username: "new_user",
  email: "user@example.com",
  roleId: 2,
  departmentId: 1
};

const userResult = await validator.validateUser(userData);

// Validate order
const orderData = {
  customerId: 123,
  items: [
    { productId: 1, quantity: 2, price: 10.00 },
    { productId: 2, quantity: 1, price: 25.00 }
  ],
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "US"
  },
  paymentMethod: "credit_card",
  discountCode: "SAVE10"
};

const orderResult = await validator.validateOrder(orderData);
```

## Real-time Validation Service

A WebSocket-based real-time validation service:

```javascript
class ValidationService {
  constructor() {
    this.schemas = new Map();
    this.validationSessions = new Map();
    this.setupSchemas();
  }

  setupSchemas() {
    // Real-time chat message validation
    this.schemas.set('chatMessage', new Schema({
      content: {
        type: String,
        required: true,
        rules: {
          lengthMin: 1,
          lengthMax: 500,
          custom: (value) => {
            // Check for spam patterns
            const spamPatterns = [
              /(.)\1{10,}/, // Repeated characters
              /http[s]?:\/\/[^\s]+/i, // URLs (if not allowed)
              /\b(buy|sell|discount|offer)\b.*\b(now|today|urgent)\b/i // Spam words
            ];

            for (const pattern of spamPatterns) {
              if (pattern.test(value)) {
                return {
                  result: false,
                  details: 'Message appears to be spam'
                };
              }
            }

            return true;
          }
        }
      },
      
      userId: {
        type: Number,
        required: true,
        rules: { min: 1 }
      },
      
      roomId: {
        type: String,
        required: true,
        rules: {
          regex: /^[a-zA-Z0-9_-]+$/,
          lengthMin: 1,
          lengthMax: 50
        }
      },
      
      timestamp: {
        type: Date,
        required: true,
        rules: {
          custom: (value) => {
            const now = new Date();
            const messageTime = new Date(value);
            const diffMs = Math.abs(now - messageTime);
            const diffMinutes = diffMs / (1000 * 60);

            return {
              result: diffMinutes <= 5,
              details: diffMinutes <= 5 ? '' : 'Message timestamp too old'
            };
          }
        }
      }
    }));

    // Live form validation
    this.schemas.set('liveForm', new Schema({
      formId: {
        type: String,
        required: true,
        rules: {
          regex: /^[a-zA-Z0-9_-]+$/
        }
      },
      
      fieldName: {
        type: String,
        required: true,
        rules: {
          lengthMin: 1,
          lengthMax: 100
        }
      },
      
      value: {
        type: 'any',
        required: false // Can be empty during typing
      },
      
      sessionId: {
        type: String,
        required: true,
        rules: {
          regex: /^[a-f0-9-]{36}$/ // UUID format
        }
      }
    }));
  }

  validateRealtime(schemaName, data, sessionId) {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      return {
        valid: false,
        error: 'Unknown schema',
        timestamp: new Date()
      };
    }

    const result = schema.validate(data);
    
    // Store validation state for the session
    if (!this.validationSessions.has(sessionId)) {
      this.validationSessions.set(sessionId, {
        validations: [],
        startTime: new Date()
      });
    }

    const session = this.validationSessions.get(sessionId);
    session.validations.push({
      schema: schemaName,
      data,
      result,
      timestamp: new Date()
    });

    // Clean up old validations (keep only last 100)
    if (session.validations.length > 100) {
      session.validations = session.validations.slice(-100);
    }

    return {
      valid: result.ok,
      errors: result.errors,
      fieldErrors: result.errorsByKeys,
      timestamp: new Date(),
      sessionStats: {
        totalValidations: session.validations.length,
        validCount: session.validations.filter(v => v.result.ok).length,
        sessionDuration: new Date() - session.startTime
      }
    };
  }

  getSessionStats(sessionId) {
    const session = this.validationSessions.get(sessionId);
    if (!session) {
      return null;
    }

    const validations = session.validations;
    const now = new Date();
    const recentValidations = validations.filter(
      v => (now - v.timestamp) < 60000 // Last minute
    );

    return {
      totalValidations: validations.length,
      recentValidations: recentValidations.length,
      successRate: validations.length > 0 
        ? validations.filter(v => v.result.ok).length / validations.length 
        : 0,
      averageResponseTime: this.calculateAverageResponseTime(validations),
      sessionDuration: now - session.startTime,
      mostCommonErrors: this.getMostCommonErrors(validations)
    };
  }

  calculateAverageResponseTime(validations) {
    if (validations.length < 2) return 0;
    
    let totalTime = 0;
    for (let i = 1; i < validations.length; i++) {
      totalTime += validations[i].timestamp - validations[i-1].timestamp;
    }
    
    return totalTime / (validations.length - 1);
  }

  getMostCommonErrors(validations) {
    const errorCount = {};
    
    validations
      .filter(v => !v.result.ok)
      .forEach(v => {
        v.result.errors.forEach(error => {
          errorCount[error] = (errorCount[error] || 0) + 1;
        });
      });

    return Object.entries(errorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));
  }

  cleanupSession(sessionId) {
    this.validationSessions.delete(sessionId);
  }

  cleanupOldSessions(maxAgeMs = 3600000) { // 1 hour
    const now = new Date();
    
    for (const [sessionId, session] of this.validationSessions.entries()) {
      if ((now - session.startTime) > maxAgeMs) {
        this.validationSessions.delete(sessionId);
      }
    }
  }
}

// WebSocket server integration
class ValidationWebSocketServer {
  constructor() {
    this.validationService = new ValidationService();
    this.connections = new Map();
    
    // Cleanup old sessions every 30 minutes
    setInterval(() => {
      this.validationService.cleanupOldSessions();
    }, 1800000);
  }

  handleConnection(ws, sessionId) {
    this.connections.set(sessionId, ws);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        this.handleValidationRequest(ws, sessionId, data);
      } catch (error) {
        this.sendError(ws, 'Invalid JSON message');
      }
    });

    ws.on('close', () => {
      this.connections.delete(sessionId);
      this.validationService.cleanupSession(sessionId);
    });
  }

  handleValidationRequest(ws, sessionId, request) {
    const { type, schema, data } = request;

    switch (type) {
      case 'validate':
        const result = this.validationService.validateRealtime(
          schema, 
          data, 
          sessionId
        );
        
        this.sendResponse(ws, {
          type: 'validation_result',
          result,
          requestId: request.id
        });
        break;

      case 'get_stats':
        const stats = this.validationService.getSessionStats(sessionId);
        
        this.sendResponse(ws, {
          type: 'session_stats',
          stats,
          requestId: request.id
        });
        break;

      default:
        this.sendError(ws, 'Unknown request type');
    }
  }

  sendResponse(ws, response) {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(response));
    }
  }

  sendError(ws, error) {
    this.sendResponse(ws, {
      type: 'error',
      error,
      timestamp: new Date()
    });
  }
}

// Client-side usage example
class RealtimeValidator {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.pendingRequests = new Map();
    this.requestId = 0;

    this.ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      this.handleResponse(response);
    };
  }

  validateField(schema, data) {
    return new Promise((resolve, reject) => {
      const requestId = ++this.requestId;
      
      this.pendingRequests.set(requestId, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'validate',
        schema,
        data,
        id: requestId
      }));

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Validation timeout'));
        }
      }, 5000);
    });
  }

  getStats() {
    return new Promise((resolve, reject) => {
      const requestId = ++this.requestId;
      
      this.pendingRequests.set(requestId, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'get_stats',
        id: requestId
      }));
    });
  }

  handleResponse(response) {
    const { requestId, type } = response;
    
    if (requestId && this.pendingRequests.has(requestId)) {
      const { resolve } = this.pendingRequests.get(requestId);
      this.pendingRequests.delete(requestId);
      resolve(response);
    }
  }
}

// Usage
const validator = new RealtimeValidator('ws://localhost:8080');

// Validate chat message in real-time
const validateChatMessage = async (message) => {
  const response = await validator.validateField('chatMessage', {
    content: message.content,
    userId: message.userId,
    roomId: message.roomId,
    timestamp: new Date()
  });

  return response.result;
};

// Live form validation
const validateFormField = async (formId, fieldName, value) => {
  const response = await validator.validateField('liveForm', {
    formId,
    fieldName,
    value,
    sessionId: getCurrentSessionId()
  });

  return response.result;
};
```

## Next Steps

- Review [API Reference](/api-reference) for complete documentation
- Explore [Built-in Utilities](/built-in-utilities) for additional validation helpers
- See [TypeScript Support](/typescript-support) for type-safe advanced patterns