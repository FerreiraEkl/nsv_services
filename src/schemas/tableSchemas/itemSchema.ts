import { IItem } from '../interfaces/IItem';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';

class Item extends db.Model<IItem> implements IItem {
    COD_ITEM!: number;
    COD_DOC!: string;
    EX_WORKS!: Date | null;
    DENOMINACAO!: string;
    QUANTIDADE!: number;
    MOTIVO_RECUSA!: string;
    MATERIAL!: number;
    VALOR!: number;
    COD_OFERTA!: string | null;

    public static associations: {
        document: db.Association<Item, Document>,
        offer: db.Association<Item, Document>
    };
}

Item.init(
    {
        COD_ITEM: {
            type: db.DataTypes.INTEGER,
            primaryKey: true
        },
        COD_DOC: {
            type: new db.DataTypes.STRING,
            primaryKey: true
        },
        EX_WORKS: {
            type: new db.DataTypes.DATE
        },
        DENOMINACAO: {
            type: new db.DataTypes.STRING
        },
        QUANTIDADE: {
            type: new db.DataTypes.INTEGER
        },
        MOTIVO_RECUSA: {
            type: new db.DataTypes.STRING
        },
        MATERIAL: {
            type: new db.DataTypes.INTEGER
        },
        VALOR: {
            type: new db.DataTypes.DOUBLE
        },
        COD_OFERTA: {
            type: new db.DataTypes.STRING
        }
    },
    {
        tableName: "ITEM",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { Item };