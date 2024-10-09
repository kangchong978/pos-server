'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'gender', {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: true
    });

    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.STRING(500),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users', 'dob');
    await queryInterface.removeColumn('users', 'gender');
    await queryInterface.removeColumn('users', 'address');
  }
};
