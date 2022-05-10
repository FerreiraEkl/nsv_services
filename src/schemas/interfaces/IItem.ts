export interface IItem {
    COD_ITEM: number;
    COD_DOC: string;
    
    EX_WORKS: Date | null;
    DENOMINACAO: string;
    QUANTIDADE: number;
    MOTIVO_RECUSA: string;
    MATERIAL: number;
    VALOR: number;

    COD_OFERTA: string|null;
}