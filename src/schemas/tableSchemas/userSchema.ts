import { IUser } from '../interfaces/IUser';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize'
import { Workgroup } from './workgroupSchema';

class User extends db.Model<IUser> implements IUser {
    COD_USU!: number;
    COD_SAP!: number;
    COD_AREA!: number;
    NOME_USU!: string;
    USU_USU!: string;
    PERFIL!: number;
    RESPONSAVEL!: boolean;
    TIPO_RESP!: string;
    COORDENADOR!: boolean;
    TIPO_COOR!: string;

    public static associations: {
        workgroup: db.Association<User, Workgroup>
    };
}

User.init(
    {
        COD_USU: {
            type: new db.DataTypes.NUMBER,
            primaryKey: true
        },
        COD_SAP: {
            type: new db.DataTypes.NUMBER,
            allowNull: true
        },
        COD_AREA: {
            type: new db.DataTypes.INTEGER
        },
        NOME_USU: {
            type: new db.DataTypes.STRING
        },
        USU_USU: {
            type: new db.DataTypes.STRING
        },
        PERFIL: {
            type: new db.DataTypes.NUMBER
        },
        RESPONSAVEL: {
            type: db.DataTypes.BOOLEAN
        },
        TIPO_RESP: {
            type: new db.DataTypes.STRING
        },
        COORDENADOR: {
            type: db.DataTypes.BOOLEAN
        },
        TIPO_COOR: {
            type: new db.DataTypes.STRING
        },
    },
    {
        tableName: "USUARIO",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { User };