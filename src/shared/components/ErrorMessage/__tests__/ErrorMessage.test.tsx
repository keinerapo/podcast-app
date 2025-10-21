import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  describe('Rendering', () => {
    it('should render error message', () => {
      render(<ErrorMessage message="Something went wrong" />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should have role="alert" for accessibility', () => {
      render(<ErrorMessage message="Error occurred" />);

      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
    });

    it('should have aria-live="assertive" for screen readers', () => {
      render(<ErrorMessage message="Error occurred" />);

      const container = screen.getByRole('alert');
      expect(container).toHaveAttribute('aria-live', 'assertive');
    });
  });

  describe('Styling', () => {
    it('should apply default container styles', () => {
      render(<ErrorMessage message="Error" />);

      const container = screen.getByRole('alert');
      expect(container).toBeInTheDocument();
      expect(container.className).toBeTruthy();
    });

    it('should apply additional className if provided', () => {
      render(<ErrorMessage message="Error" className="custom-class" />);

      const container = screen.getByRole('alert');
      expect(container.className).toContain('custom-class');
    });

    it('should not break if className is not provided', () => {
      render(<ErrorMessage message="Error" />);

      const container = screen.getByRole('alert');
      expect(container.className).toBeTruthy();
      expect(container.className).not.toContain('undefined');
    });
  });

  describe('Content', () => {
    it('should display short error messages', () => {
      render(<ErrorMessage message="Error" />);

      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    it('should display long error messages', () => {
      const longMessage =
        'This is a very long error message that explains in detail what went wrong and how to potentially fix it';
      render(<ErrorMessage message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should display error messages with special characters', () => {
      render(<ErrorMessage message="Error: Failed to load podcast's data!" />);

      expect(screen.getByText("Error: Failed to load podcast's data!")).toBeInTheDocument();
    });
  });

  describe('Message styling', () => {
    it('should have message class on paragraph', () => {
      render(<ErrorMessage message="Error" />);

      const message = screen.getByText('Error');
      expect(message.tagName).toBe('P');
      expect(message.className).toBeTruthy();
    });
  });
});
