import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Header } from '../Header';

describe('Header', () => {
  it('should render logo content', () => {
    const logo = <div data-testid="test-logo">Logo</div>;
    render(<Header logo={logo} />);

    expect(screen.getByTestId('test-logo')).toBeInTheDocument();
  });

  it('should render actions when provided', () => {
    const logo = <div>Logo</div>;
    const actions = <button data-testid="test-action">Action</button>;

    render(<Header logo={logo} actions={actions} />);

    expect(screen.getByTestId('test-action')).toBeInTheDocument();
  });

  it('should not render actions section when not provided', () => {
    const logo = <div>Logo</div>;
    const { container } = render(<Header logo={logo} />);

    // Actions div should not be in the document
    const actionsDiv = container.querySelector('[class*="actions"]');
    expect(actionsDiv).not.toBeInTheDocument();
  });

  it('should have correct semantic HTML structure', () => {
    const logo = <div>Logo</div>;
    const { container } = render(<Header logo={logo} />);

    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('should render multiple action items', () => {
    const logo = <div>Logo</div>;
    const actions = (
      <>
        <button data-testid="action-1">Action 1</button>
        <button data-testid="action-2">Action 2</button>
      </>
    );

    render(<Header logo={logo} actions={actions} />);

    expect(screen.getByTestId('action-1')).toBeInTheDocument();
    expect(screen.getByTestId('action-2')).toBeInTheDocument();
  });

  it('should accept any ReactNode as logo', () => {
    const complexLogo = (
      <div data-testid="complex-logo">
        <img src="logo.png" alt="Logo" />
        <span>Text</span>
      </div>
    );

    render(<Header logo={complexLogo} />);

    expect(screen.getByTestId('complex-logo')).toBeInTheDocument();
  });
});
