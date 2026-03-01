/**
 * OrdersList - User Orders Display
 * 
 * Exibe histórico de pedidos do usuário
 * Extraído de MyAccountPage para melhor organização
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getLocalizedRoute, normalizeLanguage } from '../../config/routes';

interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  line_items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
}

interface OrdersListProps {
  orders: Order[];
  loading: boolean;
}

export const OrdersList: React.FC<OrdersListProps> = memo(({ orders, loading }) => {
  const { t, i18n } = useTranslation();
  const currentLang = normalizeLanguage(i18n.language);

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'processing':
        return 'bg-warning/20 text-warning';
      case 'failed':
        return 'bg-error/20 text-error';
      default:
        return 'bg-white/20 text-white/70';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p>{t('account.orders.loading')}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto mb-4 text-white/30" size={64} />
        <h3 className="text-2xl font-semibold mb-3">{t('account.orders.no_orders')}</h3>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          {t('account.orders.no_orders_desc')}
        </p>
        <Link to={getLocalizedRoute('shop', currentLang)} className="btn btn-primary">
          {t('account.orders.browse_shop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('account.orders.title')}</h2>
        <Link to={getLocalizedRoute('shop', currentLang)} className="btn btn-primary">
          {t('account.orders.continue_shopping')}
        </Link>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {t('account.orders.order_number', { id: order.id })}
                </h3>
                <p className="text-sm text-white/60">
                  {new Date(order.date_created).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">R$ {order.total}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}`}>
                  {t(`account.orders.status.${order.status}`, { defaultValue: order.status })}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {order.line_items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm border-t border-white/5 pt-2">
                  <span className="text-white/80">{item.name} x{item.quantity}</span>
                  <span className="font-semibold">R$ {item.total}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary re-renders.
OrdersList.displayName = 'OrdersList';
