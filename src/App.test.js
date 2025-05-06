import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Mundo Perruno/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders description text', () => {
  render(<App />);
  const descElement = screen.getByText(/Descubre razas y disfruta imágenes/i);
  expect(descElement).toBeInTheDocument();
});
