export interface ICustomer {
    COD_CLI?: number;
    NOME_CLI: string;
    //COD_COUNTRY: string; CONFIGURAR

    PAIS: string;// remover após configurar cod_country
    CONTINENTE: string; // remover após configurar cod_country

    // CHAVES ESTRANGEIRAS =====================================
    COD_FILI?: string;
}