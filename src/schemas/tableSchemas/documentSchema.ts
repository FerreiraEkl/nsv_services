import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize'
import { IDocument } from '../interfaces/IDocument';
import { Branch } from './branchSchema';
import { Currency } from './currencySchema';
import { Customer } from './customerSchema';
import { DocumentAssignment } from './documentAssignmentSchema';
import { DocumentStatus } from './documentStatusSchema';
import { Item } from './itemSchema';
import { Project } from './projectSchema';
import { Requester } from './requesterSchema';
import { Revision } from './revisionSchema';
import { SapTeam } from './sapTeamSchema';
import { User } from './userSchema';
import { Workgroup } from './workgroupSchema';

class Document extends db.Model<IDocument> implements IDocument {

    COD_DOC!: string;
    TIPO_DOC!: string;
    CMT_DOC?: string;
    STATUS_INSPECAO?: string;
    CMT_PROJ?: string;
    DOC_SAP?: string;
    PED_REF?: string;
    COND_EXP?: string;
    NUM_SERIE?: string;
    DOC_CLI?: string;
    MATERIAL?: string;
    PAI?: string;

    PRZ_DEM_ENVIO?: number;
    PRZ_PRI_ENVIO?: number;
    QTD_LINHAS!: number;
    PRIORIZADO?: boolean;
    ENVIAR_DOC?: boolean;
    COM_DESCONTO?: boolean;
    TEM_PARALELA?: boolean;
    AGENDAR_INSP?: boolean;
    ENVIAR_IC?: boolean;
    ENVIAR_ITP?: boolean;
    VERIFICAR_FD?: boolean;
    CONF_INSP?: boolean;
    OV_APROV?: boolean;
    INSPECAO?: boolean;
    LU?: boolean;
    N_ATD_DT_SLCTD?: boolean;
    MAT_NOVO?: boolean;
    LP_AMT?: boolean;
    documentHasNotification?: boolean;

    VALOR_DOC?: number;
    VALOR_MODI?: number;
    VALOR_PAI?: number;
    VALOR_VENDIDO_DE_OFERTA?: number;
    VALOR_VENDIDO_DE_PROJETO?: number;

    DT_APROV?: Date | null;
    EX_WORKS_DESEJADO?: Date | null;
    DT_RCB_DOC?: Date | null;
    DT_ENV_DOC?: Date | null;
    DT_REGISTRO!: Date | null;
    DT_REMESSA?: Date | null;
    DT_CONF?: Date | null;
    DT_RCB_CMT?: Date | null;
    DT_INSP_INICIO?: Date | null;
    DT_INSP_TERMINO?: Date | null;
    DT_FREEZING_POINT?: Date | null;
    DT_FOLLOW_UP?: Date | null;

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

    public static associations: {
        items: db.Association<Document, Item>,
        responsible: db.Association<Document, User>,
        coordinator: db.Association<Document, User>,
        offers: db.Association<Document, Document>,
        orders: db.Association<Document, Document>,
        project: db.Association<Document, Project>,
        customer: db.Association<Document, Customer>,
        assignments: db.Association<Document, DocumentAssignment>,
        sapteam: db.Association<Document, SapTeam>,
        currency: db.Association<Document, Currency>,
        branch: db.Association<Document, Branch>,
        workgroup: db.Association<Document, Workgroup>,
        documentstatus: db.Association<Document, DocumentStatus>,
        revisions: db.Association<Document, Revision>,
        requester: db.Association<Document, Requester>
    };
}

Document.init({
    COD_DOC: {
        type: new db.DataTypes.STRING,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    TIPO_DOC: {
        type: new db.DataTypes.STRING,
        allowNull: false
    },
    PED_REF: {
        type: new db.DataTypes.STRING,
        allowNull: true
    },
    NUM_SERIE: {
        type: new db.DataTypes.STRING
    },
    MATERIAL: {
        type: new db.DataTypes.STRING
    },
    CMT_DOC: {
        type: new db.DataTypes.STRING
    },
    COND_EXP: {
        type: new db.DataTypes.STRING,
        allowNull: true
    },
    DOC_CLI: {
        type: new db.DataTypes.STRING
    },
    STATUS_INSPECAO: {
        type: new db.DataTypes.STRING
    },
    CMT_PROJ: {
        type: new db.DataTypes.STRING
    },
    DOC_SAP: {
        type: new db.DataTypes.STRING
    },
    PAI: {
        type: new db.DataTypes.STRING
    },
    PRZ_DEM_ENVIO: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 14
    },
    PRZ_PRI_ENVIO: {
        type: new db.DataTypes.INTEGER,
        defaultValue: 28
    },
    QTD_LINHAS: {
        type: new db.DataTypes.INTEGER,
        defaultValue: 0
    },
    PRIORIZADO: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    ENVIAR_DOC: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    COM_DESCONTO: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    TEM_PARALELA: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    AGENDAR_INSP: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    ENVIAR_IC: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    ENVIAR_ITP: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    VERIFICAR_FD: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    CONF_INSP: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    OV_APROV: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    INSPECAO: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    LU: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    N_ATD_DT_SLCTD: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    MAT_NOVO: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    LP_AMT: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    documentHasNotification: {
        type: db.DataTypes.BOOLEAN,
        defaultValue: false
    },
    VALOR_DOC: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    VALOR_MODI: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    VALOR_PAI: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    VALOR_VENDIDO_DE_OFERTA: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    VALOR_VENDIDO_DE_PROJETO: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    DT_APROV: {
        type: new db.DataTypes.DATE
    },
    EX_WORKS_DESEJADO: {
        type: new db.DataTypes.DATE
    },
    DT_RCB_DOC: {
        type: new db.DataTypes.DATE
    },
    DT_ENV_DOC: {
        type: new db.DataTypes.DATE
    },
    DT_REGISTRO: {
        type: new db.DataTypes.DATE
    },
    DT_REMESSA: {
        type: new db.DataTypes.DATE
    },
    DT_CONF: {
        type: new db.DataTypes.DATE
    },
    DT_RCB_CMT: {
        type: new db.DataTypes.DATE
    },
    DT_INSP_INICIO: {
        type: new db.DataTypes.DATE
    },
    DT_INSP_TERMINO: {
        type: new db.DataTypes.DATE
    },
    DT_FREEZING_POINT: {
        type: new db.DataTypes.DATE
    },
    DT_FOLLOW_UP: {
        type: new db.DataTypes.DATE
    }
},
    {
        tableName: "documento",
        sequelize,
        timestamps: false,
        freezeTableName: true
    });

export { Document };