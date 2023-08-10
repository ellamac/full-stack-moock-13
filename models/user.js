const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Validation isEmail on username failed',
        },
        notNull: {
          msg: 'Validation notNull on username failed',
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Validation notNull on username failed',
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
