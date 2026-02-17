import { describe, expect, test } from '@jest/globals';
import { Schema } from '../Schema';
class Parent {
    constructor(value) {
        this.value = value;
        this.version = 1;
    }
    getV() {
        return this.version;
    }
}
class Child extends Parent {
    constructor(value) {
        super(value);
        this.isDeep = true;
    }
}
class CustomString extends String {
    constructor(value) {
        super(value);
    }
    isEmpty() {
        return this !== undefined && this.length === 0;
    }
}
describe('Тестирование кастомного типа', () => {
    test('Значения, созданные из кастомных типов, корректно проходят проверку', () => {
        const keys = ['cust1', 'cust2', 'cust3', 'badKey'];
        const err = new Error('ops');
        const parent = new Parent(1);
        const child = new Child(2);
        const child2 = new Child(3);
        const schema = new Schema({
            [keys[0]]: {
                type: Error,
                required: true
            },
            [keys[1]]: {
                type: Parent,
                required: true
            },
            [keys[2]]: {
                type: Child,
                required: true
            },
        });
        const obj = {
            [keys[0]]: err,
            [keys[1]]: parent,
            [keys[2]]: child,
        };
        const res = schema.validate(obj);
        const allKeysArePassed = [
            res.byKeys[keys[0]] === true,
            res.byKeys[keys[1]] === true,
            res.byKeys[keys[2]] === true,
        ].every(k => k === true);
        expect(res.ok).toBe(true);
        expect(allKeysArePassed).toBe(true);
    });
    test('Дочерний класс не проходит проверку по родительскому классу', () => {
        const keys = ['cust1', 'cust2', 'cust3'];
        const parent = new Parent(1);
        const child = new Child(2);
        const schema = new Schema({
            [keys[0]]: {
                type: Parent,
                required: true
            },
            [keys[1]]: {
                type: Child,
                required: true
            },
            [keys[2]]: {
                type: Parent,
                required: true
            },
        });
        const obj = {
            [keys[0]]: parent,
            [keys[1]]: child,
            [keys[2]]: child,
        };
        const res = schema.validate(obj);
        const allKeysArePassed = [
            res.byKeys[keys[0]] === true,
            res.byKeys[keys[1]] === true,
            res.byKeys[keys[2]] === false,
        ].every(k => k === true);
        expect(res.ok).toBe(false);
        expect(allKeysArePassed).toBe(true);
        expect(res.failed.includes(keys[2])).toBe(true);
    });
    test('Унаследованный класс от String не проходит проверку как String', () => {
        const keys = ['cust0', 'cust1', 'cust2', 'cust3', 'undef'];
        const origin = new String('str1');
        const origin2 = 'str2';
        const custom = new CustomString('str3');
        const schema = new Schema({
            [keys[0]]: {
                type: String,
                required: true,
                title: "test String to String"
            },
            [keys[1]]: {
                type: CustomString,
                required: true,
                title: "test CustomString to CustomString"
            },
            [keys[2]]: {
                type: CustomString,
                required: true,
                title: "test String to CustomString"
            },
            [keys[3]]: {
                type: String,
                required: true,
                title: "test CustomString to String"
            },
            [keys[4]]: {
                type: String,
                required: true,
                title: "test undefined to String"
            },
        });
        const obj = {
            [keys[0]]: origin,
            [keys[1]]: custom,
            [keys[2]]: origin2,
            [keys[3]]: custom,
        };
        const res = schema.validate(obj);
        const allKeysArePassed = [
            res.byKeys[keys[0]] === true,
            res.byKeys[keys[1]] === true,
            res.byKeys[keys[2]] === false,
            res.byKeys[keys[3]] === false,
            res.byKeys[keys[4]] === false,
        ].every(k => k === true);
        expect(res.ok).toBe(false);
        expect(allKeysArePassed).toBe(true);
        expect(res.failed.includes(keys[2])).toBe(true);
        expect(res.failed.includes(keys[3])).toBe(true);
        expect(res.failed.includes(keys[4])).toBe(true);
    });
});
