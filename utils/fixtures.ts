import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handler';

export type TestOption = {
    api: RequestHandler
}

export const test = base.extend<TestOption>({
    api: async({}, use) => {
        const requestHandler = new RequestHandler();
        await use(requestHandler);
    }
})