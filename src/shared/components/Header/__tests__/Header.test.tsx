import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

vi.mock('@shared/components/LoadingIndicator', () => ({
  LoadingIndicator: () => <div data-testid="loading-indicator">Loading...</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header', () => {
  it('should render the application title', () => {
    renderWithRouter(<Header />);

    const title = screen.getByRole('heading', { name: /podcaster/i });
    expect(title).toBeInTheDocument();
  });

  it('should render a link to home page', () => {
    renderWithRouter(<Header />);

    const homeLink = screen.getByRole('link', { name: /podcaster/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render the LoadingIndicator component', () => {
    renderWithRouter(<Header />);

    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should have correct semantic HTML structure', () => {
    const { container } = renderWithRouter(<Header />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render title inside a heading element', () => {
    renderWithRouter(<Header />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Podcaster');
  });
});
