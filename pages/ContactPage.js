const { expect } = require('@playwright/test');

class ContactPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.messageTextarea = page.locator('textarea[name="message"]');
    this.submitButton = page.locator('text=Submit');
  }

  async fillForm(name, email, message) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.messageTextarea.fill(message);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  getURL() {
    return this.page.url();
  }
}

module.exports = ContactPage;