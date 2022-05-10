import { ISourceSystem } from '../interfaces/ISourceSystem';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';

class SourceSystem extends db.Model<ISourceSystem> implements ISourceSystem {
    COD_SIST!: string;
    DESC_SIST!: string;

    public static associations: {
        documents: db.Association<SourceSystem, Document>
    };
}

SourceSystem.init(
    {
        COD_SIST: {
            type: new db.DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        DESC_SIST: {
            type: new db.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "SIST_ORIGEM",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { SourceSystem };