import { IBranch } from '../interfaces/IBranch';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';
import { Customer } from './customerSchema';
import { Currency } from './currencySchema';

class Branch extends db.Model<IBranch> implements IBranch {
    COD_FILI!: string;
    NOME_FILI!: string;

    COD_MOEDA?: string;

    public static associations: {
        documents: db.Association<Branch, Document>,
        customers: db.Association<Branch, Customer>,
        currency: db.Association<Branch, Currency>
    };
}

Branch.init(
    {
        COD_FILI: {
            type: new db.DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        NOME_FILI: {
            type: new db.DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "FILIAL",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { Branch };