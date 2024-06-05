import { expect, request } from "@playwright/test";

export class ServicesAPI {
    constructor() {

    }

    async postNewUser(user: string, password: string) {
        const context = await request.newContext()
        const response = await context.post(`/Account/v1/User`, {
            data: {
                "userName": user,
                "password": password
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response.status(), `Request (Account/v1/User) failed\nStatus: ${(response.status())} ${response.statusText()}`).toBe(201)
        return response.json();
    }

    async postLogin(user: string, password: string) {
        const context = await request.newContext()
        const response = await context.post(`/Account/v1/Login`, {
            data: {
                "userName": user,
                "password": password
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        expect(response.status(), `Request (Account/v1/Login) failed\nStatus: ${(response.status())} ${response.statusText()}`).toBe(200)
        return response.json();
    }

    async getBooks() {
        const context = await request.newContext()
        const response = await context.get(`/BookStore/v1/Books`);
        expect(response.status(), `Request (BookStore/v1/Books) failed\nStatus: ${(response.status())} ${response.statusText()}`).toBe(200)
        return response.json();
    }

    async postInvalidUser(user: string, password: string) {
        const context = await request.newContext()
        const response = await context.post(`/Account/v1/User`, {
            data: {
                "userName": user,
                "password": password
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const status = response.status();
        if (status !== 400 && status !== 406) {
            throw new Error(`Request (Account/v1/User) failed\nStatus: ${status} ${response.statusText()}`);
        }
        return response.json();
    }
}
