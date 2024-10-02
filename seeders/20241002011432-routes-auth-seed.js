'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const routes = [
      { route: '/pos', role: 'admin' },
      { route: '/dashboard', role: 'admin' },
      { route: '/products', role: 'admin' },
      { route: '/sales', role: 'admin' },
      { route: '/orders', role: 'admin' },
      { route: '/analytics', role: 'admin' },
      { route: '/employees', role: 'admin' },
      { route: '/settings', role: 'admin' }
    ];

    await queryInterface.bulkInsert('routes_auth', routes.map(route => ({
      ...route,
      enable: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })));
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('routes_auth', null, {});
  }
};
