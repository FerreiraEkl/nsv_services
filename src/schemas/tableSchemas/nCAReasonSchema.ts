import { INCAReason } from '../interfaces/INCAReason';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';

class NCAReason extends db.Model<INCAReason> implements INCAReason {
    COD_MOTI_NCA!: number;
    DESC_MOTI_NCA!: string;

    public static associations: {
        documents: db.Association<NCAReason, Document>
    };
}

NCAReason.init(
    {
        COD_MOTI_NCA: {
            type: new db.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement:true
        },
        DESC_MOTI_NCA: {
            type: new db.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "MOTIVO_NCA",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { NCAReason };