const { test, expect } = require('./fixtures');

const CONTACT_URL = /contact/i;

test.describe('QA Practice contact form', () => {
  test('should navigate to contact page and confirm form fields', async ({ homePage, contactPage }) => {
    await test.step('Navigate to contact page', async () => {
      await homePage.goto();
      await homePage.clickContact();
      await expect(contactPage.getURL()).toMatch(CONTACT_URL);
    });

    await test.step('Validate contact form fields visibility', async () => {
      await expect(contactPage.nameInput).toBeVisible();
      await expect(contactPage.emailInput).toBeVisible();
      await expect(contactPage.messageTextarea).toBeVisible();
    });

    await test.step('Complete and submit contact form', async () => {
      await contactPage.fillForm('Playwright Tester', 'tester@example.com', 'Automated test message');
      await contactPage.submitForm();
    });
  });
});
