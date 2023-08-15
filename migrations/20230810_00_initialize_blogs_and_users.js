const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      author: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: {
            msg: 'Validation isUrl on url failed',
          },
          notNull: {
            msg: 'Validation notNull on url failed',
          },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Validation notNull on title failed',
          },
        },
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
    await queryInterface.createTable('users', {
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
    });
    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs');
    await queryInterface.dropTable('users');
  },
};
