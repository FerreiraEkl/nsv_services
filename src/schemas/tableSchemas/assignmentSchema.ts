import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize';
import { IAssignment } from '../interfaces/IAssignment';

class Assignment extends db.Model<IAssignment> implements IAssignment {
    COD_TAR?: number;
    DESC_TAR!: string;
}

Assignment.init({
    COD_TAR: {
        type: db.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DESC_TAR: {
        type: new db.DataTypes.STRING,
        allowNull: true
    }
},
    {
        tableName: "TAREFA",
        sequelize,
        timestamps: false,
        freezeTableName: true
    });

export { Assignment };