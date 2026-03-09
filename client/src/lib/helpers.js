import random from 'random'

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

export const exampleID = (idElements, separator = '') => {
    return idElements.map(el => {
        switch (el.idElementType) {
            case 'TEXT':
                return el.fixedText
            case 'RANDOM_20_BIT':
                return random.int(0, 1048575)
            case 'RANDOM_32_BIT':
                return random.int(0, 4294967295)
            case 'RANDOM_6_DIGIT':
                return random.int(100000, 999999)
            case 'RANDOM_9_DIGIT':
                return random.int(100000000, 999999999)
            case 'GUID':
                return crypto.randomUUID()
            case 'DATE':
                return new Date().toISOString()
            case 'SEQUENCE':
                return 0
            default:
                return ''
        }
    }).filter(el => el !== '').join(separator);
}