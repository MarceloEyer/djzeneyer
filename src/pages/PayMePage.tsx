import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ChevronDown, DollarSign } from 'lucide-react';
import { paymentMethods } from '../data/paymentMethods';
import { HeadlessSEO } from '../components/HeadlessSEO';

export function PayMePage() {
  const { t } = useTranslation();
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const seoContent = {
    title: t('payme.title'),
    description: t('payme.description'),
    path: '/payme',
  };

  const sortedMethods = [...paymentMethods].sort((a, b) => a.priority - b.priority);

  return (
    <>
      <HeadlessSEO {...seoContent} />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <div className="pt-24 pb-12 px-4 text-center border-b border-slate-700">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <DollarSign className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {t('payme.heading')}
              </h1>
            </div>
            <p className="text-xl text-slate-300 mb-4">
              {t('payme.subtitle')}
            </p>
            <p className="text-slate-400 text-sm">
              {t('payme.description')}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Payment Methods Grid */}
          <div className="space-y-4">
            {sortedMethods.map((method) => (
              <div
                key={method.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg hover:border-red-500/50 transition-all duration-300"
              >
                {/* Method Header */}
                <button
                  onClick={() =>
                    setExpandedMethod(
                      expandedMethod === method.id ? null : method.id
                    )
                  }
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">
                        {method.label}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {method.details.type || method.details.bank}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-red-400 bg-red-900/30 px-3 py-1 rounded">
                      {method.currency}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedMethod === method.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Method Details */}
                {expandedMethod === method.id && (
                  <div className="border-t border-slate-700 px-6 py-6 bg-slate-900/50">
                    {/* Instructions */}
                    {method.instructions && (
                      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
                        <p className="text-blue-300 text-sm">
                          💡 {method.instructions}
                        </p>
                      </div>
                    )}

                    {/* Copyable Fields */}
                    <div className="space-y-3">
                      {method.copyableFields.map((field) => (
                        <div
                          key={field.field}
                          className="flex items-center justify-between gap-3 p-4 bg-slate-800/50 rounded border border-slate-700 hover:border-slate-600 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-400 mb-1">
                              {field.label}
                            </p>
                            <p className="text-sm text-white font-mono break-all">
                              {field.value}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              copyToClipboard(field.value, field.field)
                            }
                            className="flex-shrink-0 p-2 hover:bg-slate-700 rounded transition-colors"
                            title="Copiar"
                          >
                            {copiedField === field.field ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {Object.entries(method.details).map(([key, value]) => (
                        <div key={key} className="p-3 bg-slate-900/50 rounded">
                          <p className="text-xs font-medium text-slate-400 mb-1 capitalize">
                            {key}
                          </p>
                          <p className="text-sm text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                {t('payme.for_donors')}
              </h3>
              <p className="text-slate-300 mb-4">
                {t('payme.donors_description')}
              </p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>✓ Qualquer valor é bem-vindo</li>
                <li>✓ Suporta múltiplas moedas</li>
                <li>✓ Sem mínimo obrigatório</li>
              </ul>
            </div>

            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                {t('payme.for_clients')}
              </h3>
              <p className="text-slate-300 mb-4">
                {t('payme.clients_description')}
              </p>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>✓ Transferências internacionais</li>
                <li>✓ Pagamento em sua moeda</li>
                <li>✓ Métodos diversos</li>
              </ul>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 p-6 bg-amber-900/20 border border-amber-800/50 rounded-lg">
            <p className="text-amber-300 text-sm">
              🔒 Todos os dados são confidenciais e seguros. Nunca compartilharemos suas informações.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
