import * as db from '../../config/configSequelize';
import { sequelize } from '../../config/configSequelize'

const DocumentRelationship = sequelize.define('AUTO_DOC', {
    COD_1: new db.DataTypes.STRING,
    COD_2: new db.DataTypes.STRING
  }, {
    freezeTableName: true,
    timestamps: false
  });

export { DocumentRelationship };