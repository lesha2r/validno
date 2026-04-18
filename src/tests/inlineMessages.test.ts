/* eslint-disable no-unused-vars */
import { describe, expect, test } from '@jest/globals';
import { Schema } from '../Schema';

describe('Inline rule messages (Zod-like syntax)', () => {
    test('Inline message is used when rule fails', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                rules: {
                    isEmail: { value: true, message: 'Введите корректный адрес электронной почты' }
                }
            }
        });

        const result = schema.validate({ email: 'invalid-email' });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Введите корректный адрес электронной почты');
    });

    test('Inline message works with lengthMinMax rule', () => {
        const schema = new Schema({
            password: {
                type: String,
                required: true,
                rules: {
                    lengthMinMax: { value: [8, 100], message: 'Пароль должен содержать не менее 8 символов' }
                }
            }
        });

        const result = schema.validate({ password: 'short' });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Пароль должен содержать не менее 8 символов');
    });

    test('Inline message works with min/max rules', () => {
        const schema = new Schema({
            age: {
                type: Number,
                required: true,
                rules: {
                    min: { value: 18, message: 'Вам должно быть не менее 18 лет' }
                }
            }
        });

        const result = schema.validate({ age: 15 });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Вам должно быть не менее 18 лет');
    });

    test('Simple rule syntax still works (backward compatibility)', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                rules: {
                    isEmail: true
                }
            }
        });

        const result = schema.validate({ email: 'invalid' });

        expect(result.ok).toBe(false);
        expect(result.errors[0]).toContain('email');
    });

    test('Mixed inline and simple syntax works', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                rules: {
                    isEmail: { value: true, message: 'Invalid email format' },
                    lengthMin: 5
                }
            }
        });

        const result = schema.validate({ email: 'x' });

        expect(result.ok).toBe(false);
        // Should have both errors - inline message for isEmail and default for lengthMin
        expect(result.errors.some((e: string) => e === 'Invalid email format')).toBe(true);
    });

    test('customMessage callback takes priority over inline message', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                rules: {
                    isEmail: { value: true, message: 'Inline message' }
                },
                customMessage: ({ keyword }) => {
                    if (keyword === 'isEmail') return 'Custom callback message';
                    return 'Other error';
                }
            }
        });

        const result = schema.validate({ email: 'invalid' });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Custom callback message');
        expect(result.errors).not.toContain('Inline message');
    });

    test('Inline message with enum rule', () => {
        const schema = new Schema({
            status: {
                type: String,
                required: true,
                rules: {
                    enum: { value: ['active', 'inactive'], message: 'Выберите корректный статус' }
                }
            }
        });

        const result = schema.validate({ status: 'unknown' });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Выберите корректный статус');
    });

    test('Inline message with regex rule', () => {
        const schema = new Schema({
            phone: {
                type: String,
                required: true,
                rules: {
                    regex: { value: /^\+7\d{10}$/, message: 'Введите номер в формате +7XXXXXXXXXX' }
                }
            }
        });

        const result = schema.validate({ phone: '12345' });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Введите номер в формате +7XXXXXXXXXX');
    });
});

describe('requiredMessage shorthand', () => {
    test('requiredMessage is used when required field is missing', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                requiredMessage: 'Введите ваш имейл'
            }
        });

        const result = schema.validate({});

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Введите ваш имейл');
    });

    test('requiredMessage takes priority over default error', () => {
        const schema = new Schema({
            name: {
                type: String,
                required: true,
                requiredMessage: 'Пожалуйста, укажите имя'
            }
        });

        const result = schema.validate({});

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Пожалуйста, укажите имя');
        expect(result.errors.some((e: string) => e.includes('is missing'))).toBe(false);
    });

    test('requiredMessage works with nested objects', () => {
        const schema = new Schema({
            user: {
                email: {
                    type: String,
                    required: true,
                    requiredMessage: 'Email пользователя обязателен'
                }
            }
        });

        const result = schema.validate({ user: {} });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Email пользователя обязателен');
    });

    test('customMessage callback takes priority over requiredMessage', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                requiredMessage: 'Required message shorthand',
                customMessage: ({ keyword }) => {
                    if (keyword === 'missing') return 'Custom callback for missing';
                    return 'Other error';
                }
            }
        });

        const result = schema.validate({});

        expect(result.ok).toBe(false);
        expect(result.errors).toContain('Custom callback for missing');
        expect(result.errors).not.toContain('Required message shorthand');
    });

    test('requiredMessage does not affect type validation errors', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                requiredMessage: 'Field is required'
            }
        });

        // Provide a value of wrong type
        const result = schema.validate({ email: 123 });

        expect(result.ok).toBe(false);
        // Should NOT use requiredMessage for type error
        expect(result.errors).not.toContain('Field is required');
    });

    test('requiredMessage does not affect rule validation errors', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                requiredMessage: 'Field is required',
                rules: {
                    isEmail: true
                }
            }
        });

        // Provide a value that fails rule validation
        const result = schema.validate({ email: 'not-an-email' });

        expect(result.ok).toBe(false);
        // Should NOT use requiredMessage for rule error
        expect(result.errors).not.toContain('Field is required');
    });
});

describe('Combined features work together', () => {
    test('Form schema with all message types', () => {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                requiredMessage: 'Email обязателен',
                rules: {
                    isEmail: { value: true, message: 'Введите корректный email' }
                }
            },
            password: {
                type: String,
                required: true,
                requiredMessage: 'Пароль обязателен',
                rules: {
                    lengthMinMax: { value: [8, 100], message: 'Пароль от 8 до 100 символов' }
                }
            },
            age: {
                type: Number,
                required: false,
                rules: {
                    min: { value: 18, message: 'Вам должно быть 18+' }
                }
            }
        });

        // Test missing required field
        const result1 = schema.validate({ password: 'validpass123' });
        expect(result1.ok).toBe(false);
        expect(result1.errors).toContain('Email обязателен');

        // Test invalid email format
        const result2 = schema.validate({ email: 'invalid', password: 'validpass123' });
        expect(result2.ok).toBe(false);
        expect(result2.errors).toContain('Введите корректный email');

        // Test short password
        const result3 = schema.validate({ email: 'test@test.com', password: 'short' });
        expect(result3.ok).toBe(false);
        expect(result3.errors).toContain('Пароль от 8 до 100 символов');

        // Test underage
        const result4 = schema.validate({ email: 'test@test.com', password: 'validpass123', age: 16 });
        expect(result4.ok).toBe(false);
        expect(result4.errors).toContain('Вам должно быть 18+');

        // Test valid data
        const result5 = schema.validate({ email: 'test@test.com', password: 'validpass123', age: 25 });
        expect(result5.ok).toBe(true);
    });
});
