import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { Document } from './documentSchema';
import { IProject } from '../interfaces/IProject';
import { User } from './userSchema';

class Project extends db.Model<IProject> implements IProject {

    COD_PROJ?: number;
    NOME!: string;
    DESC_PLANTA!: string;
    CMT_PROJ!: string;
    STATUS!: boolean;
    DOC_MODELO!: string;
    VALOR_POTENCIAL!: number;
    DT_REG!: Date;

    public static associations: {
        documents: db.Association<Project, Document>,
        responsible: db.Association<Project, User>,
        coordinator: db.Association<Project, User>
    };
}

Project.init({
    COD_PROJ: {
        type: new db.DataTypes.INTEGER,
        primaryKey: true
    },
    NOME: {
        type: new db.DataTypes.STRING
    },
    DESC_PLANTA: {
        type: new db.DataTypes.STRING
    },
    CMT_PROJ: {
        type: new db.DataTypes.STRING
    },
    STATUS: {
        type: db.DataTypes.BOOLEAN
    },
    DOC_MODELO: {
        type: new db.DataTypes.STRING
    },
    VALOR_POTENCIAL: {
        type: new db.DataTypes.DOUBLE
    },
    DT_REG: {
        type: db.DataTypes.DATE
    }
},
    {
        tableName: "PROJETO",
        sequelize,
        timestamps: false,
        freezeTableName: true
    });

export { Project };