import { render, screen, cleanup } from '@testing-library/react';
import Todo from './Todo';

const originalFetch = global.fetch;

afterEach(() => {
  cleanup();
  global.fetch = originalFetch;
});

test('shows an API error when the todo request fails', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ message: 'Database unavailable' }),
  });

  render(<Todo />);

  expect(
    await screen.findByText('Unable to load todo items: Database unavailable')
  ).toBeInTheDocument();
});
