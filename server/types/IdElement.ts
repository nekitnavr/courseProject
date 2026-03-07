import { IdElementType } from "../generated/prisma/enums"

export default interface IdElement{
    id?: number,
    idConfigId?: string,
    fixedText?: string,
    idElementType: IdElementType
}