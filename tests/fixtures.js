const { test: base, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ContactPage = require('../pages/ContactPage');

const test = base.extend({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  contactPage: async ({ page }, use) => {
    const contactPage = new ContactPage(page);
    await use(contactPage);
  },
});

module.exports = { test, expect };