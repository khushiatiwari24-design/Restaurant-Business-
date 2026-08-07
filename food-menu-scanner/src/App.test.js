import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the restaurant hero heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', {
    name: /craving something extraordinary/i,
  });
  expect(heading).toBeInTheDocument();
});
