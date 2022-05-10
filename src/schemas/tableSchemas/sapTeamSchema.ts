import { ISapTeam } from '../interfaces/ISapTeam';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';

class SapTeam extends db.Model<ISapTeam> implements ISapTeam {
    COD_EQUI_SAP!: string;
    NOME_EQUI_SAP!: string;
    SECAO!: string;

    public static associations: {
        documents: db.Association<SapTeam, Document>
    };
}

SapTeam.init(
    {
        COD_EQUI_SAP: {
            type: new db.DataTypes.STRING(3),
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        NOME_EQUI_SAP: {
            type: new db.DataTypes.STRING,
            allowNull: false
        },
        SECAO: {
            type: new db.DataTypes.STRING(4),
            allowNull: false
        }
    },
    {
        tableName: "EQUIPE_SAP",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { SapTeam };