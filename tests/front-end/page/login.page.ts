import { Page, expect } from '@playwright/test';

export default class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goToLoginPage() {
        await this.page.locator('button[id="login"]').click();
    }

    async waitForLoginPageTitle() {
        await this.page.waitForSelector('form[id="userForm"]:has-text("Login in Book Store")');
    }

    async login(username: string, password: string) {
        await this.page.locator('input[id="userName"]').fill(username);
        await this.page.locator('input[id="password"]').fill(password);
        await this.page.locator('button[id="login"]').click();
    }

    async validateLoginSuccessfully(message: string) {
        await expect(async () => {
            await expect(this.page.locator('label[id="userName-value"]').filter({ hasText: message })).toBeVisible();
        }).toPass({
            timeout: 10_000
        });
    }
}
