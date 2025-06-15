import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { beforeAll } from 'vitest';

// Setup jsdom environment for React testing
import '@testing-library/jest-dom';

beforeAll(() => {
  // Any global test setup can go here
});

// Clean up after each test case
afterEach(() => {
  cleanup();
});
