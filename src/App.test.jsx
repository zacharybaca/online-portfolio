import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
  it('renders the navigation sidebar', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Checks if your navigation exists (adjust text if your menu is different)
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });
});
