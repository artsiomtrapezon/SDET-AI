const { test, expect } = require('./fixtures');

const HEADER_TEXT = /Hello!/i;
const TITLE_TEXT = /Home Page | QA Practice/i;

test.describe('QA Practice homepage checks', () => {
  test.beforeEach(async ({ homePage }) => {
    await test.step('Navigate to homepage', async () => {
      await homePage.goto();
    });
  });

  test('should load homepage and verify title', async ({ homePage }) => {
    await test.step('Verify homepage title', async () => {
      await expect(await homePage.getTitle()).toMatch(TITLE_TEXT);
    });
  });

  test('should display main header and primary navigation', async ({ homePage }) => {
    await test.step('Verify main header text and visibility', async () => {
      await expect(homePage.header).toBeVisible();
      await expect(homePage.header).toContainText(HEADER_TEXT);
    });

    await test.step('Verify primary navigation links', async () => {
      await expect(homePage.navLinks.first()).toBeVisible();
    });
  });
});
