// Regression coverage for populated shop rows and their translation scope.
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ShopPage from '../../pages/ShopPage';

const locale = vi.hoisted(() => ({ language: 'en' }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `${locale.language}:${key}`,
    i18n: { language: locale.language },
  }),
  Trans: () => null,
}));

vi.mock('../../hooks/useQueries', () => {
  const products = [{
    id: 1,
    slug: 'test-release',
    name: 'Test release',
    price: '10',
    regular_price: '10',
    stock_status: 'instock',
    images: [{ src: '/test.jpg' }],
    categories: [],
    short_description: '',
    description: '',
    on_sale: false,
  }];
  return {
    useShopPageQuery: () => ({
      isLoading: false,
      data: { featured: null, new_releases: products, best_sellers: [], curated: [] },
    }),
    useAddToCartMutation: () => ({ mutateAsync: vi.fn() }),
  };
});

vi.mock('../../components/HeadlessSEO', () => ({ HeadlessSEO: () => null }));
vi.mock('../../components/Breadcrumb', () => ({ Breadcrumb: () => null }));
vi.mock('../../components/common/Toast', () => ({ Toast: () => null }));

afterEach(cleanup);

describe('ShopPage populated catalog', () => {
  it.each(['en', 'pt'])('renders product rows without throwing in %s', (language) => {
    locale.language = language;
    render(<MemoryRouter><ShopPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: `${language}:shop.new_releases` })).toBeInTheDocument();
    expect(screen.getByText('Test release')).toBeInTheDocument();
  });
});
