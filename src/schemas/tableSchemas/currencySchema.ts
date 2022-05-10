import { ICurrency } from '../interfaces/ICurrency';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';

class Currency extends db.Model<ICurrency> implements ICurrency {

    COD_MOEDA!: string;
    MULT_EUR!: number;
    MULT_USD!: number;
    MULT_BRL!: number;
    ANO_REF!: number;

    public static associations: {
        documents: db.Association<Currency, Document>
    };
}

Currency.init(
    {
        COD_MOEDA: {
            type: new db.DataTypes.STRING(3),
            primaryKey: true,
            allowNull: false,
            autoIncrement: false
        },
        MULT_EUR:{
            type:new db.DataTypes.DOUBLE,
            allowNull:false
        },
        MULT_USD:{
            type:new db.DataTypes.DOUBLE,
            allowNull:false
        },
        MULT_BRL:{
            type:new db.DataTypes.DOUBLE,
            allowNull:false
        },
        ANO_REF:{
            type:new db.DataTypes.INTEGER,
            allowNull:false
        }
    },
    {
        tableName: "MOEDA",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { Currency };