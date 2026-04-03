const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;
    this.header = page.locator('h1');
    this.navLinks = page.locator('a', { hasText: /Contact|Login|Register/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickContact() {
    await this.page.click('a:text("Contact")');
  }

  async getHeaderText() {
    return await this.header.textContent();
  }

  async getTitle() {
    return await this.page.title();
  }
}

module.exports = HomePage;