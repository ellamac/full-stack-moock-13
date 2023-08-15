const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      defaultValue: new Date().getFullYear(),
      validate: {
        isBetweenYears(value) {
          const thisYear = new Date().getFullYear();
          if (parseInt(value) < 1991 || parseInt(value) > thisYear) {
            throw new Error('Year has to be between 1991 and current year');
          }
        },
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'created_at');
    await queryInterface.removeColumn('users', 'updated_at');
    await queryInterface.removeColumn('blogs', 'updated_at');
    await queryInterface.removeColumn('blogs', 'updated_at');
  },
};
