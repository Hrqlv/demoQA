import { login } from '../fixtures/data.ts'
import { faker } from '@faker-js/faker';

export function createUser() {
    const name = faker.person.middleName()
    const dateNow = Date.now()
    return {
        userName: `Qa${name}-${dateNow}`,
        password: login.password,
    };
}
