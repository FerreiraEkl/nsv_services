import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
    Op
} from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME || '',
    process.env.DB_USER || '',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || '',
        port: parseInt(process.env.DB_PORT || ''),
        dialect: 'mysql',
        timezone: '-03:00',
        "logging": false
    }
);

export {
    sequelize,
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
    Op
};