import { IDocumentStatus } from '../interfaces/IDocumentStatus';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';

class DocumentStatus extends db.Model<IDocumentStatus> implements IDocumentStatus {

    COD_STATUS_DOC!: number;
    DESC_STATUS_DOC!: string;
    TIPO_DOC!: string;

    public static associations: {
        documents: db.Association<DocumentStatus, Document>
    };
}

DocumentStatus.init(
    {
        COD_STATUS_DOC: {
            type: new db.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        DESC_STATUS_DOC: {
            type: new db.DataTypes.STRING,
            allowNull: false
        },
        TIPO_DOC: {
            type: new db.DataTypes.STRING(4),
            allowNull: false
        }
    },
    {
        tableName: "STATUS_DOC",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { DocumentStatus };