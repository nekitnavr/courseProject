import random from 'random'
import { IdElement } from '../generated/prisma/client';

export default (idElements: IdElement[], separator = '', sequenceNumber: Number) => {
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
                return sequenceNumber
            default:
                return ''
        }
    }).filter(el => el !== '').join(separator);
}