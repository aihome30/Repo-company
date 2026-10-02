import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '@/components/Navbar';

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(<Navbar />);
    expect(screen.getByText('Rizki AI')).toBeInTheDocument();
  });
});
