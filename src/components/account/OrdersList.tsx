/**
 * OrdersList - User Orders Display
 * 
 * Exibe histórico de pedidos do usuário
 * Extraído de MyAccountPage para melhor organização
 */

import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

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

const getOrderStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': 'Completed',
    'processing': 'Processing',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
    'pending': 'Pending',
  };
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
};

export const OrdersList: React.FC<OrdersListProps> = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto mb-4 text-white/30" size={64} />
        <h3 className="text-2xl font-semibold mb-3">No orders yet</h3>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Start exploring our exclusive content and merchandise!
        </p>
        <Link to="/shop" className="btn btn-primary">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order History</h2>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
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
                <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                <p className="text-sm text-white/60">
                  {new Date(order.date_created).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">R$ {order.total}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}`}>
                  {getOrderStatusText(order.status)}
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
};
