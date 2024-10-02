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
    await queryInterface.bulkInsert('settings', [{
      company_name: 'Default Company',
      company_logo: null,
      tax: 0.00,
      address: '123 Default Street, Default City, 12345',
      email: 'info@defaultcompany.com',
      website: 'www.defaultcompany.com',
      phone_number: '(123) 456-7890',
      receipt_footer_text: 'Thank you for your business!',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
