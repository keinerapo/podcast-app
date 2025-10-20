import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SearchFilter } from '../SearchFilter';

describe('SearchFilter', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    resultsCount: 50,
    totalCount: 100,
  };

  it('should render search input with correct attributes', () => {
    render(<SearchFilter {...defaultProps} />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Filter podcasts...');
  });

  it('should display results count', () => {
    render(<SearchFilter {...defaultProps} />);

    const count = screen.getByText('50');
    expect(count).toBeInTheDocument();
  });

  it('should display results count description for screen readers', () => {
    render(<SearchFilter {...defaultProps} />);

    const description = screen.getByText(/showing 50 of 100 podcasts/i);
    expect(description).toBeInTheDocument();
  });

  it('should call onSearchChange when user types', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<SearchFilter {...defaultProps} onSearchChange={onSearchChange} />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    await user.type(input, 'test');

    expect(onSearchChange).toHaveBeenCalledTimes(4);
    expect(onSearchChange).toHaveBeenCalled();
  });

  it('should display the current search query value', () => {
    render(<SearchFilter {...defaultProps} searchQuery="react" />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    expect(input).toHaveValue('react');
  });

  it('should update results count when prop changes', () => {
    const { rerender } = render(<SearchFilter {...defaultProps} resultsCount={50} />);

    expect(screen.getByText('50')).toBeInTheDocument();

    rerender(<SearchFilter {...defaultProps} resultsCount={25} />);

    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.queryByText('50')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<SearchFilter {...defaultProps} />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    expect(input).toHaveAttribute('aria-label', 'Filter podcasts by name or author');
    expect(input).toHaveAttribute('aria-describedby', 'search-results-count');
  });

  it('should have accessible label', () => {
    render(<SearchFilter {...defaultProps} />);

    const label = screen.getByLabelText(/filter podcasts by name or author/i);
    expect(label).toBeInTheDocument();
  });

  it('should have live region for results count', () => {
    const { container } = render(<SearchFilter {...defaultProps} />);

    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('should handle empty search query', () => {
    render(<SearchFilter {...defaultProps} searchQuery="" />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    expect(input).toHaveValue('');
  });

  it('should handle zero results', () => {
    render(<SearchFilter {...defaultProps} resultsCount={0} totalCount={100} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/showing 0 of 100 podcasts/i)).toBeInTheDocument();
  });

  it('should handle all results matching (no filter)', () => {
    render(<SearchFilter {...defaultProps} resultsCount={100} totalCount={100} />);

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/showing 100 of 100 podcasts/i)).toBeInTheDocument();
  });

  it('should call onSearchChange with empty string when input is cleared', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(<SearchFilter {...defaultProps} searchQuery="test" onSearchChange={onSearchChange} />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    await user.clear(input);

    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('should maintain input focus after typing', async () => {
    const user = userEvent.setup();

    render(<SearchFilter {...defaultProps} />);

    const input = screen.getByRole('textbox', { name: /filter podcasts/i });
    await user.click(input);
    await user.type(input, 'a');

    expect(input).toHaveFocus();
  });
});
