import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';
import { IRevision } from '../interfaces/IRevision';

class Revision extends db.Model<IRevision> implements IRevision {

    COD_REV?: number;
    COD_DOC?: string;
    CMT_REV!: string;
    NUM_REV!: number;
    DIFERENCA_VALOR!: number;
    VALOR_ANTIGO!: number;
    NUM_LINHAS_REVISADAS!: number;
    DT_SUB_REV!: Date;
    DT_RCB_REV!: Date;
    DT_RG_REV!: Date;

    public static associations: {
        document: db.Association<Revision, Document>
    };
}

Revision.init({
    COD_REV: {
        type: new db.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    CMT_REV: {
        type: new db.DataTypes.TEXT
    },
    NUM_REV: {
        type: new db.DataTypes.INTEGER,
        allowNull: false
    },
    DIFERENCA_VALOR: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    VALOR_ANTIGO: {
        type: new db.DataTypes.DOUBLE,
        defaultValue: 0
    },
    NUM_LINHAS_REVISADAS: {
        type: new db.DataTypes.INTEGER,
        defaultValue: 1
    },
    DT_SUB_REV: {
        type: new db.DataTypes.DATE,
        allowNull: false
    },
    DT_RCB_REV: {
        type: new db.DataTypes.DATE,
    },
    DT_RG_REV: {
        type: new db.DataTypes.DATE,
        allowNull: false
    }
},
    {
        tableName: "REVISAO",
        sequelize,
        timestamps: false,
        freezeTableName: true
    });

export { Revision };