export interface IRevision {
    COD_REV?: number;
    COD_DOC?: string;

    DT_SUB_REV: Date;
    CMT_REV: string;
    DT_RCB_REV: Date;
    NUM_REV: number;

    DT_RG_REV: Date;
    DIFERENCA_VALOR: number;
    VALOR_ANTIGO: number;
    NUM_LINHAS_REVISADAS: number;
}