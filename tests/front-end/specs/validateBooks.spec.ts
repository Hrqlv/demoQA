import { test, expect } from '@playwright/test';
import LoginPage from '../page/login.page';
import { ServicesAPI } from '../../api/servicesAPI';
import { login } from "../../../fixtures/data";

let loginPage: any;
const servicesApi = new ServicesAPI();

test.describe('Validate Books @BOOKS', () => {
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('/books');
    });

    test('Login and validate books', async ({ page }) => {
        let booksReponse: any;
        let displayedBooks: any;

        await test.step('Login', async () => {
            await loginPage.goToLoginPage();
            await loginPage.waitForLoginPageTitle();
            await loginPage.login(login.userName, login.password);
            await loginPage.validateLoginSuccessfully(login.name);
        });

        await test.step('Get books from API', async () => {
            booksReponse = await servicesApi.getBooks();
        });

        await test.step('Get displayed books from the site', async () => {
            displayedBooks = await page.$$('div.rt-tbody span[id*="see-book-"]');
        });

        await test.step('Validate the number of books', async () => {
            const booksLength = booksReponse.books.length;
            const displayedBooksLength = displayedBooks.length;
            expect(displayedBooksLength).toBe(booksLength);
        });

        await test.step('Validate the titles of the books', async () => {
            const displayedBooksTitles = await Promise.all(displayedBooks.map(book => book.innerText()));
            for (let i = 0; i < booksReponse.books.length; i++) {
                expect(displayedBooksTitles[i]).toContain(booksReponse.books[i].title);
            }
        });
    });

    test('Validate books', async ({ page }) => {
        let booksReponse: any;
        let displayedBooks: any;

        await test.step('Get books from API', async () => {
            booksReponse = await servicesApi.getBooks();
        });

        await test.step('Get displayed books from the site', async () => {
            displayedBooks = await page.$$('div.rt-tbody span[id*="see-book-"]');
        });

        await test.step('Validate the number of books', async () => {
            const booksLength = booksReponse.books.length;
            const displayedBooksLength = displayedBooks.length;
            expect(displayedBooksLength).toBe(booksLength);
        });

        await test.step('Validate the titles of the books', async () => {
            const displayedBooksTitles = await Promise.all(displayedBooks.map(book => book.innerText()));
            for (let i = 0; i < booksReponse.books.length; i++) {
                expect(displayedBooksTitles[i]).toContain(booksReponse.books[i].title);
            }
        });
    });
});
