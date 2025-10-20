import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LoadingIndicator } from '../LoadingIndicator';

const mockUseLoading = vi.fn();
vi.mock('@app/providers', () => ({
  useLoading: () => mockUseLoading(),
}));

describe('LoadingIndicator', () => {
  it('should render loading indicator when isLoading is true', () => {
    mockUseLoading.mockReturnValue({ isLoading: true, setIsLoading: vi.fn() });

    render(<LoadingIndicator />);

    const indicator = screen.getByRole('status');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(indicator).toHaveAttribute('aria-label', 'Loading');
  });

  it('should not render when isLoading is false', () => {
    mockUseLoading.mockReturnValue({ isLoading: false, setIsLoading: vi.fn() });

    const { container } = render(<LoadingIndicator />);

    const indicator = screen.queryByRole('status');
    expect(indicator).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('should have proper accessibility attributes', () => {
    mockUseLoading.mockReturnValue({ isLoading: true, setIsLoading: vi.fn() });

    render(<LoadingIndicator />);

    const indicator = screen.getByRole('status');
    expect(indicator).toHaveAttribute('role', 'status');
    expect(indicator).toHaveAttribute('aria-live', 'polite');
    expect(indicator).toHaveAttribute('aria-label', 'Loading');
  });

  it('should render spinner element', () => {
    mockUseLoading.mockReturnValue({ isLoading: true, setIsLoading: vi.fn() });

    const { container } = render(<LoadingIndicator />);

    const spinner = container.querySelector('[class*="spinner"]');
    expect(spinner).toBeInTheDocument();
  });
});
