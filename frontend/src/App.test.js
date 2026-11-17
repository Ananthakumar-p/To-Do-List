import { render, screen } from '@testing-library/react';
import App from './App';

test('renders todo app heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /todo list project/i });
  expect(headingElement).toBeInTheDocument();
});
