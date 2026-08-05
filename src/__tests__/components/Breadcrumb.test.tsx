import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb } from '../../components/Breadcrumb';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));

describe('Breadcrumb', () => {
  it('renders breadcrumb links with full text contrast', () => {
    render(
      <MemoryRouter>
        <Breadcrumb items={[{ label: 'Events' }]} />
      </MemoryRouter>,
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('text-text');
    expect(list).not.toHaveClass('text-text/90');
    expect(screen.getByRole('link', { name: /nav\.home/i })).toBeInTheDocument();
  });
});
