import { ICustomerCoordinator } from '../interfaces/ICustomerCoordinator';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Customer } from './customerSchema';
import { User } from './userSchema';

class CustomerCoordinator extends db.Model<ICustomerCoordinator> implements ICustomerCoordinator {
    COD_CLI!: number;
    COD_COOR!: number;

    public static associations: {
        customer: db.Association<CustomerCoordinator, Customer>,
        coordinator: db.Association<CustomerCoordinator, User>
    };
}

CustomerCoordinator.init(
    {
        COD_CLI: {
            type: new db.DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false,
            autoIncrement:false
        },
        COD_COOR: {
            type: new db.DataTypes.STRING,
            primaryKey:true,
            allowNull: false,
            autoIncrement:false
        }
    },
    {
        tableName: "CLI_COOR",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { CustomerCoordinator };