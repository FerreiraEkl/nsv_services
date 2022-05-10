export interface IUser {
    COD_USU?: number | null;

    NOME_USU: string;
    USU_USU: string;
    PERFIL: number;
    RESPONSAVEL: boolean;
    TIPO_RESP: string;
    COORDENADOR: boolean;
    TIPO_COOR: string;

    COD_SAP?: Number;
    COD_AREA: number;
}
