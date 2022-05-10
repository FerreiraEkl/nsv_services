import { IDocumentAssignment } from '../interfaces/IDocumentAssignment';
import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';
import { Assignment } from './assignmentSchema';

class DocumentAssignment extends db.Model<IDocumentAssignment> implements IDocumentAssignment {

    COD_DOC?: string;
    COD_TAR?: number;

    STATUS!: boolean;
    CMT_TAR!: string;
    RESPONSAVEL!: string;
    PRAZO!: number;


    public static associations: {
        document: db.Association<DocumentAssignment, Document>,
        assignment: db.Association<DocumentAssignment, Assignment>
    };
}

DocumentAssignment.init(
    {
        COD_DOC: {
            type: new db.DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false
        },
        COD_TAR: {
            type: new db.DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: false
        },
        STATUS: {
            type: db.DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        CMT_TAR: {
            type: new db.DataTypes.TEXT
        },
        RESPONSAVEL: {
            type: new db.DataTypes.STRING(3),
            allowNull: false
        },
        PRAZO: {
            type: new db.DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "DOC_TAR",
        sequelize,
        timestamps: false,
        freezeTableName: true
    }
);

export { DocumentAssignment };