export const mapFieldValues = (fields)=>(Object.entries(fields).map(([key, value]) => ({
    fieldId: key,
    value: value
})))

export const typeMap = {
    'SINGLE_LINE': 'singleLine',
    'MULTI_LINE': 'multiLine',
    'BOOL': 'bool',
    'NUMERIC': 'numeric'
}

export const maxFieldCount = 3;
export const initialFieldCounter = {
    'SINGLE-LINE': 0,
    'MULTI-LINE': 0,
    'NUMERIC': 0,
    'BOOL': 0,
}