import { IRequester } from '../interfaces/IRequester';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';
import { User } from './userSchema';

class Requester extends db.Model<IRequester> implements IRequester {

    COD_SOLI?: number;
    NOME_SOLI!: string;

    COD_COOR?: number | undefined;

    public static associations: {
        documents: db.Association<Requester, Document>,
        coordinator: db.Association<Requester, User>
    };
}

Requester.init(
    {
        COD_SOLI: {
            type: new db.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        NOME_SOLI: {
            type: new db.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "SOLICITANTE",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { Requester };