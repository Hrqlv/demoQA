import { test, expect } from '@playwright/test';
import { ServicesAPI } from './servicesAPI';
import { createUser } from "../../helpers/helpers";
import { login } from "../../fixtures/data";
import { validateJsonSchema } from "./jsonSchemaValidatorClasses/validateJsonSchema";

let servicesApi = new ServicesAPI();
let user: any, userID: any;

test.describe('API Tests @API', async () => {
    test.beforeEach(async () => {
        user = createUser();
    });

    test('Create user and validate created user schema', async () => {
        await test.step('Create user', async () => {
            const newUserResponse = await servicesApi.postNewUser(user.userName, user.password);
            await validateJsonSchema('POST_NewUser', newUserResponse);
            expect(newUserResponse.username).toBe(user.userName);
            userID = await newUserResponse.userID
        });

        await test.step('Login and validate user', async () => {
            const loginResponse = await servicesApi.postLogin(user.userName, user.password);
            await validateJsonSchema('POST_Login', loginResponse);
            expect(loginResponse.username).toBe(user.userName)
            expect(loginResponse.password).toBe(user.password)
            expect(loginResponse.userId).toBe(userID)
        });
    });

    test('Get books', async () => {
        const booksResponse = await servicesApi.getBooks();
        await validateJsonSchema('GET_Books', booksResponse);
        expect(booksResponse.books.length).toBe(8);
        expect(booksResponse.books).toEqual(expect.arrayContaining([
            expect.objectContaining({ title: 'Git Pocket Guide' }),
            expect.objectContaining({ title: 'Learning JavaScript Design Patterns' }),
            expect.objectContaining({ title: 'Designing Evolvable Web APIs with ASP.NET' }),
            expect.objectContaining({ title: 'Speaking JavaScript' }),
            expect.objectContaining({ title: 'You Don\'t Know JS' }),
            expect.objectContaining({ title: 'Programming JavaScript Applications' }),
            expect.objectContaining({ title: 'Eloquent JavaScript, Second Edition' }),
            expect.objectContaining({ title: 'Understanding ECMAScript 6' }),
        ]));
    });

    test.describe('Negative API Tests @NEGATIVES', async () => {
        test('Validate error message when trying to create already registered user', async () => {
            let invalidUserResponse: any;

            await test.step('Fill registration data', async () => {
                invalidUserResponse = await servicesApi.postInvalidUser(login.userName, login.password);
            });

            await test.step('Validate that the user has already been registered', async () => {
                await validateJsonSchema('POST_InvalidUser', invalidUserResponse);
                expect(invalidUserResponse.code).toBe('1204');
                expect(invalidUserResponse.message).toBe('User exists!');
            });
        });

        test('Validate error message when trying to register user without meeting password requirements', async () => {
            let invalidUserResponse: any;

            await test.step('Fill password without capital letters', async () => {
                invalidUserResponse = await servicesApi.postInvalidUser(login.userName, 'teste@1234');
            });

            await test.step('Validate error message when fill password without capital letters', async () => {
                await validateJsonSchema('POST_InvalidUser', invalidUserResponse);
                expect(invalidUserResponse.code).toBe('1300');
                expect(invalidUserResponse.message).toBe("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.");
            });

            await test.step('Fill password without lowercase letters', async () => {
                invalidUserResponse = await servicesApi.postInvalidUser(login.userName, 'teste@1234');
            });

            await test.step('Validate error message when fill password without lowercase letters', async () => {
                await validateJsonSchema('POST_InvalidUser', invalidUserResponse);
                expect(invalidUserResponse.code).toBe('1300');
                expect(invalidUserResponse.message).toBe("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.");
            });

            await test.step('Fill password without special characters', async () => {
                invalidUserResponse = await servicesApi.postInvalidUser(login.userName, 'teste@1234');
            });

            await test.step('Validate error message when fill password without special characters', async () => {
                await validateJsonSchema('POST_InvalidUser', invalidUserResponse);
                expect(invalidUserResponse.code).toBe('1300');
                expect(invalidUserResponse.message).toBe("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.");
            });
        });
    });
});
