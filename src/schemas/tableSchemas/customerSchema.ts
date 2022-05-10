import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';
import { ICustomer } from '../interfaces/ICustomer';
import { Branch } from './branchSchema';
import { CustomerCoordinator } from './custromerCoordinator';
import { Currency } from './currencySchema';

class Customer extends db.Model<ICustomer> implements ICustomer {

    COD_CLI?: number;
    NOME_CLI!: string;

    PAIS!: string;
    CONTINENTE!: string;

    COD_FILI?: string;

    public static associations: {
        documents: db.Association<Customer, Document>,
        branch: db.Association<Customer, Branch>,
        coordinators: db.Association<Customer, CustomerCoordinator>,
        currency: db.Association<Customer, Currency>
    };
}

Customer.init({
    COD_CLI: {
        type: new db.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
    },
    NOME_CLI: {
        type: new db.DataTypes.STRING
    },

    PAIS: {
        type: new db.DataTypes.STRING
    },
    CONTINENTE: {
        type: new db.DataTypes.STRING
    }
},
    {
        tableName: "CLIENTE",
        sequelize,
        timestamps: false,
        freezeTableName: true
    });

export { Customer };