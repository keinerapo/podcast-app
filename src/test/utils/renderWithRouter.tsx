import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

/**
 * Custom render function that wraps component with BrowserRouter
 * Useful for testing components that use React Router hooks or Link components
 *
 * @param ui - React element to render
 * @param options - Optional render options (excluding wrapper)
 * @returns Render result from @testing-library/react
 *
 * @example
 * renderWithRouter(<MyComponent />);
 * renderWithRouter(<MyComponent />, { container: document.body });
 */
export function renderWithRouter(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: BrowserRouter,
    ...options,
  });
}
