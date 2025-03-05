import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/msw/index';

const server = setupServer(...handlers);

// start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// close server after all tests
afterAll(() => server.close());

// reset handlers after each test for test isolation
afterEach(() => server.resetHandlers());

export { server };
