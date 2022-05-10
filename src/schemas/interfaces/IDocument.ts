export interface IDocument {
    COD_DOC: string;                  // CHAVE

    // STRINGS ==================================
    TIPO_DOC: string;                 // TODOS
    CMT_DOC?: string;                 // TODOS
    STATUS_INSPECAO?: string;         // TODOS
    CMT_PROJ?: string;                // TODOS
    DOC_SAP?: string;                 // TODOS
    PED_REF?: string;                 // OFERTA E ORDEM
    COND_EXP?: string;                // OFERTA E ORDEM
    NUM_SERIE?: string;               // OFERTA      
    DOC_CLI?: string;                 // OFERTA
    MATERIAL?: string;                // CLAIM

    PAI?: string;                     // NÃO UTILIZADO --- VERIFICAR

    // CONTADORES ===============================
    PRZ_DEM_ENVIO?: number;           // TODOS
    PRZ_PRI_ENVIO?: number;           // TODOS
    QTD_LINHAS: number;               // TODOS

    // BOOLEANOS ================================

    PRIORIZADO?: boolean;             // OFERTA
    ENVIAR_DOC?: boolean;             // ORDEM E CLAIM
    COM_DESCONTO?: boolean;           // OFERTA
    TEM_PARALELA?: boolean;           // NÃO UTILIZADO --- VERIFICAR
    AGENDAR_INSP?: boolean;           // ORDEM E CLAIM
    ENVIAR_IC?: boolean;              //
    ENVIAR_ITP?: boolean;             //
    VERIFICAR_FD?: boolean;           //
    CONF_INSP?: boolean;              // 
    OV_APROV?: boolean;               //
    INSPECAO?: boolean;               //
    LU?: boolean;                     //
    N_ATD_DT_SLCTD?: boolean;         //
    MAT_NOVO?: boolean;               //
    LP_AMT?: boolean;                 // OFERTA E
    documentHasNotification?: boolean;// TODOS
    // VALORES ==================================
    VALOR_DOC?: number;               // TODOS
    VALOR_MODI?: number;              // NÃO UTILIZADO --- VERIFICAR
    VALOR_PAI?: number;               // NÃO UTILIZADO --- VERIFICAR
    VALOR_VENDIDO_DE_OFERTA?: number; // ORDENS
    VALOR_VENDIDO_DE_PROJETO?: number;// ORDENS

    // DATAS ====================================
    DT_APROV?: Date | null;           //
    EX_WORKS_DESEJADO?: Date | null;  // 
    DT_RCB_DOC?: Date | null;         //
    DT_ENV_DOC?: Date | null;         //
    DT_REGISTRO: Date | null;         //
    DT_REMESSA?: Date | null;         //
    DT_CONF?: Date | null;            //
    DT_RCB_CMT?: Date | null;         //
    DT_INSP_INICIO?: Date | null;     //
    DT_INSP_TERMINO?: Date | null;    //
    DT_FREEZING_POINT?: Date | null;  //
    DT_FOLLOW_UP?: Date | null;       //

    // CHAVES DE RELACIONAMENTO ==================
    COD_SIST?: string | null;
    COD_STATUS_DOC?: number | null;
    COD_COOR?: number | null;
    COD_RESP?: number | null;
    COD_EQUI_SAP?: string | null;
    COD_MOEDA?: string | null;
    COD_PROJ?: number | null;
    COD_AREA?: number | null;
    COD_CLI?: number | null;
    COD_USU?: number | null;
    COD_FILI?: string | null;
    COD_OEM?: number | null;
    COD_IDI?: number | null;
    COD_EQUI_OFER?: number | null;
    COD_MOTI_NCA?: number | null;
    COD_EPC?: number | null;
    COD_PAD_DOC?: number | null;
    COD_MOTI_FEC?: number | null;
    COD_SOLI?: number | null;
    COD_ENT?: number | null;
    COD_TAM?: number | null;
    COD_LINHA_PROD?: number | null;
}