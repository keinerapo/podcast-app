import { screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithRouter } from '@test/utils';

import { AppHeader } from '../AppHeader';

vi.mock('@shared/components/LoadingIndicator', () => ({
  LoadingIndicator: () => <div data-testid="loading-indicator">Loading...</div>,
}));

describe('AppHeader', () => {
  it('should render the application title', () => {
    renderWithRouter(<AppHeader />);

    const title = screen.getByRole('heading', { name: /podcaster/i });
    expect(title).toBeInTheDocument();
  });

  it('should render a link to home page', () => {
    renderWithRouter(<AppHeader />);

    const homeLink = screen.getByRole('link', { name: /podcaster/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render the LoadingIndicator component', () => {
    renderWithRouter(<AppHeader />);

    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
  });

  it('should have correct semantic HTML structure', () => {
    const { container } = renderWithRouter(<AppHeader />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render title inside a heading element', () => {
    renderWithRouter(<AppHeader />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Podcaster');
  });
});
