import { IWorkgroup } from '../interfaces/IWorkgroup';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize'
import { User } from './userSchema';
import { Document } from './documentSchema';

class Workgroup extends db.Model<IWorkgroup> implements IWorkgroup {
    COD_AREA?: number;
    UNIDADE!: string;
    DEPARTAMENTO!: string;
    SECAO!: string;
    EQUIPE!: string;

    public static associations: {
        documents: db.Association<Workgroup, Document>,
        users: db.Association<Workgroup, User>
    };
}

Workgroup.init(
    {
        COD_AREA: {
            type: new db.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        UNIDADE: {
            type: new db.DataTypes.STRING,
            allowNull: false
        },
        DEPARTAMENTO: {
            type: new db.DataTypes.STRING,
            allowNull: false
        },
        SECAO: {
            type: new db.DataTypes.STRING,
            allowNull: false
        },
        EQUIPE: {
            type: new db.DataTypes.STRING,
            allowNull: false
        },
    },
    {
        tableName: "AREA",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { Workgroup };