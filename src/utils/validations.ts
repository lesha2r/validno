import _helpers from "./helpers.js";

const _validations: {
  [key: string]: Function,
} = {};

// TYPES ::::::::::::::::::::::::::::::::::::::::::::::::::
_validations.isString = (value: any) => {
  return typeof value === 'string';
};

_validations.isNumber = (value: any) => {
  return typeof value === 'number';
};

_validations.isArray = (value: any) => {
  return Array.isArray(value);
};

_validations.isObject = (value: any) => {
  return value !== null && typeof value === 'object' && value?.constructor?.name === 'Object' && !Array.isArray(value)
};

_validations.isDate = (value: any) => {
  return value instanceof Date && String(value) !== 'Invalid Date';
};

_validations.isRegex = (value: any) => {
  return value instanceof RegExp
}

_validations.isBoolean = (value: string) => {
  return typeof value === 'boolean'
}

_validations.isNull = (value: string) => {
  return value === null
}

_validations.isUndefined = (value: string) => {
  return value === undefined
}

_validations.isNullOrUndefined = (value: string) => {
  return value === undefined || value === null;
}

// STRING FORMAT ::::::::::::::::::::::::::::::::::::::::::
_validations.isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

_validations.isDateYYYYMMDD = (value: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(value);
};

_validations.isHex = (value: string) => {
  const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  return regex.test(value);
};

// RULES ::::::::::::::::::::::::::::::::::::::::::::::::::
_validations.lengthIs = (value: any, length: number) => {
  if (typeof value !== 'string' && !Array.isArray(value)) return false
  if (typeof length !== 'number') return false
  return value.length === length;
};

_validations.lengthNot = (value: any, length: number) => {
  if (typeof value !== 'string' && !Array.isArray(value)) return false
  if (typeof length !== 'number') return false
  return value.length !== length;
};

_validations.lengthMin = (value: any, min: number) => {
  if (typeof value !== 'string' && !Array.isArray(value)) return false
  if (typeof min !== 'number') return false
  return value.length >= min;
};

_validations.lengthMax = (value: any, max: number) => {
  if (typeof value !== 'string' && !Array.isArray(value)) return false
  if (typeof max !== 'number') return false

  return value.length <= max;
};

_validations.isNumberGte = (value: any, gte: number) => {
  return typeof value === 'number' && value >= gte;
};

_validations.isNumberLte = (value: any, lte: number) => {
  return typeof value === 'number' && value <= lte;
};

_validations.hasKey = (obj: object, key: string) => {
  if (_validations.isObject(obj) === false) return false;
  return key in obj;
};

_validations.is = (value: any, compareTo: any) => {
      if (value === compareTo) {
          return true // Сразу вернуть, если совпадают
      }
  
        const bothArrays = _validations.isArray(value) && _validations.isArray(compareTo)
  
        if (bothArrays) {
          return _helpers.compareArrs(value, compareTo)
        }
  
        const bothObjects = _validations.isObject(value) && _validations.isObject(compareTo)
  
        if (bothObjects) {
          const valueStr = JSON.stringify(value)
          const compareToStr = JSON.stringify(compareTo)
          return valueStr === compareToStr
        }
  
        const bothDates =  _validations.isDate(value) && _validations.isDate(compareTo)
      
        if (bothDates) {
          return value.getTime() === compareTo.getTime();
        }
      
        return value === compareTo;
};

_validations.not = (value: any, not: any) => {
  return !_validations.is(value, not)
};
_validations.isNot = _validations.not
_validations.ne = _validations.not


_validations.regexTested = (value: string, regexp: RegExp) =>{
  if (!regexp || regexp instanceof RegExp !== true) {
    throw new Error('regexp argument is incorrect');
  }

  return regexp.test(value);
};

_validations.regex = _validations.regexTested
_validations.regexp = _validations.regexTested
_validations.test = _validations.regexTested

export default _validations
