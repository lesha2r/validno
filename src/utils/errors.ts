const _errors: {[key: string]: Function} = {}

_errors.getMissingError = (key: string) => `Ключ '${key}' отсутствует`

export default _errors

