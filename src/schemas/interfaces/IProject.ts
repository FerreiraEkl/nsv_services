export interface IProject {    
    COD_PROJ?: number;          // IDENTIFICADOR DO PROJETO
    NOME: string;               // NOME DO PROJETO
    DESC_PLANTA: string;        // PAÍS DE ORIGEM (SITE)
    CMT_PROJ: string;           // COMENTÁRIOS
    STATUS: boolean;            // ATIVO OU INATIVO
    DOC_MODELO: string;         // DOCUMENTO MODELO DO PROJETO
    VALOR_POTENCIAL: number;    // VALOR POTENCIAL DE VENDA
    DT_REG: Date;               // DATA DE CADASTRO DO PROJETO

    // CHAVES ESTRANGEIRAS ===========================================
    COD_CLI_FNL?: number;       // CLIENTE FINAL
    COD_SEG?: number;           // SEGMENTO
    COD_USU?: number;           // COORDENADOR DE PROJETOS DE ORDENS
    COD_COOR_PROJ_OF?: number;  // COORDENADOR DE PROJETOS DE OFERTAS
}