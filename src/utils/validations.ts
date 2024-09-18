const _validations: {[key: string]: Function} = {};

_validations.isString = (value: any) => {
  return typeof value === 'string';
};

_validations.isDate = (value: any) => {
  return value instanceof Date && String(value) !== 'Invalid Date';
};

_validations.isNumber = (value: any) => {
  return typeof value === 'number';
};

_validations.isNumberGte = (value: any, gte: number) => {
  return typeof value === 'number' && value >= gte;
};

_validations.isNumberLte = (value: any, lte: number) => {
  return typeof value === 'number' && value <= lte;
};

_validations.isArray = (value: any) => {
  return Array.isArray(value);
};

_validations.isObject = (value: any) => {
  return typeof value === 'object' && !Array.isArray(value) && value !== null
};

_validations.lengthIs = (value: any, length: number) => {
  return value.length === length;
};

_validations.lengthNot = (value: any, length: number) => {
  return value.length !== length;
};

_validations.lengthMin = (value: any, min: number) => {
  return value.length >= min;
};

_validations.lengthMax = (value: any, max: number) => {
  return value.length <= max;
};

_validations.isEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

_validations.isRegex = (value: any) => {
  return value instanceof RegExp
}

_validations.hasKey = (obj: object, key: string) => {
  return key in obj;
};

_validations.isNot = (value: any, not: any) => {
  if (typeof not === 'object' && Array.isArray(not)) {
    for (let i = 0; i < not.length; i++) {
      if (value === not[i]) return false;
    }

    return true;
  }

  return value !== not;
};

_validations.is = (value: any, compareTo: any) => {
  if (typeof compareTo === 'object' && Array.isArray(compareTo)) {
    for (let i = 0; i < compareTo.length; i++) {
      if (value === compareTo[i]) return true;
    }

    return false;
  }

  return value === compareTo;
};

_validations.isDateYYYYMMDD = (value: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(value);
};

_validations.regexTested = (value: string, regex: RegExp) =>{
  if (!regex) throw new Error('regex argument is not defined');
  return regex.test(value);
};

_validations.isHex = (value: string) => {
  const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  return regex.test(value);
};

_validations.isBoolean = (value: string) => {
  return typeof value === 'boolean'
}

_validations.isNull = (value: string) => {
  return value === null
}

_validations.isUndefined = (value: string) => {
  return value === undefined
}

export default _validations
