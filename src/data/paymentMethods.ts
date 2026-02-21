export interface PaymentMethod {
  id: string;
  name: string;
  label: string;
  currency: string;
  flag: string;
  icon: string;
  details: Record<string, string>;
  copyableFields: Array<{ label: string; value: string; field: string }>;
  instructions?: string;
  priority: number;
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    name: 'PIX',
    label: 'PIX (Brasil)',
    currency: 'BRL',
    flag: 'BR',
    icon: 'Zap',
    priority: 1,
    details: {
      type: 'Instantâneo',
      country: 'Brasil',
      fees: 'Sem taxas',
    },
    copyableFields: [
      {
        label: 'Chave PIX',
        value: '21987413091',
        field: 'pix',
      },
    ],
    instructions: 'Escaneie o código ou copie a chave PIX acima. Ideal para doações rápidas.',
  },
  {
    id: 'inter-brl',
    name: 'Transferência Bancária',
    label: 'Inter - Reais (BRL)',
    currency: 'BRL',
    flag: 'BR',
    icon: 'Building',
    priority: 2,
    details: {
      bank: 'INTER - 077',
      type: 'Transferência Bancária',
    },
    copyableFields: [
      {
        label: 'Titular',
        value: 'Marcelo Eyer Fernandes',
        field: 'name',
      },
      {
        label: 'CPF',
        value: '113.739.157-06',
        field: 'cpf',
      },
      {
        label: 'Agência',
        value: '0001',
        field: 'agency',
      },
      {
        label: 'Conta',
        value: '752413-7',
        field: 'account',
      },
    ],
  },
  {
    id: 'paypal',
    name: 'PayPal',
    label: 'PayPal (Internacional)',
    currency: 'USD/EUR',
    flag: 'US',
    icon: 'Globe',
    priority: 3,
    details: {
      type: 'Cartão/Banco',
      countries: 'Mais de 200 países',
      fees: 'Taxas padrão PayPal',
    },
    copyableFields: [
      {
        label: 'Email PayPal',
        value: 'eyer.marcelo@gmail.com',
        field: 'paypal',
      },
    ],
    instructions: 'Envie para o email ou use: paypal.me/marceloeyer',
  },
  {
    id: 'usd-wire',
    name: 'Wire Transfer USD',
    label: 'Wire Transfer - Dólares (USD)',
    currency: 'USD',
    flag: 'US',
    icon: 'DollarSign',
    priority: 4,
    details: {
      bank: 'Community Federal Savings Bank',
      type: 'Wire Transfer Internacional',
    },
    copyableFields: [
      {
        label: 'Titular',
        value: 'Marcelo Eyer Fernandes',
        field: 'name',
      },
      {
        label: 'Account Number',
        value: '889693163-5',
        field: 'account',
      },
      {
        label: 'WIRE Routing Number',
        value: '026073008',
        field: 'routing',
      },
      {
        label: 'Bank Name',
        value: 'Community Federal Savings Bank',
        field: 'bank',
      },
      {
        label: 'Bank Address',
        value: '5 Penn Plaza, New York, NY 10001',
        field: 'address',
      },
    ],
  },
  {
    id: 'ach-usd',
    name: 'ACH Transfer USD',
    label: 'ACH Transfer - Dólares (USD)',
    currency: 'USD',
    flag: 'US',
    icon: 'DollarSign',
    priority: 5,
    details: {
      bank: 'Community Federal Savings Bank',
      type: 'ACH Transfer (EUA)',
      fees: 'Sem taxas bancárias',
    },
    copyableFields: [
      {
        label: 'Titular',
        value: 'Marcelo Eyer Fernandes',
        field: 'name',
      },
      {
        label: 'Account Number',
        value: '889693163-5',
        field: 'account',
      },
      {
        label: 'ACH Routing Number',
        value: '026073150',
        field: 'routing',
      },
      {
        label: 'Bank Name',
        value: 'Community Federal Savings Bank',
        field: 'bank',
      },
    ],
  },
  {
    id: 'inter-usd',
    name: 'Wire Transfer USD - Brasil',
    label: 'Wire Transfer - Dólares (USD - via Inter)',
    currency: 'USD',
    flag: 'BR',
    icon: 'Globe',
    priority: 6,
    details: {
      type: 'Wire Transfer Internacional',
      destination: 'Banco Inter Brasil',
    },
    copyableFields: [
      {
        label: 'Titular',
        value: 'Marcelo Eyer Fernandes',
        field: 'name',
      },
      {
        label: 'IBAN',
        value: 'BR9600416968000010007524137C1',
        field: 'iban',
      },
      {
        label: 'Banco Intermediário',
        value: 'JP Morgan Chase N.A. | SWIFT: CHASUS33',
        field: 'intermediary',
      },
      {
        label: 'ABA',
        value: '021000021',
        field: 'aba',
      },
      {
        label: 'Account (JP Morgan)',
        value: '360556937',
        field: 'jpmorgan_account',
      },
      {
        label: 'Banco Final',
        value: 'Banco Inter SA | SWIFT: ITEMBRSP',
        field: 'final_bank',
      },
      {
        label: 'Endereço JP Morgan',
        value: '270 PARK AVENUE, NEW YORK, NY, 10017, United States',
        field: 'jpmorgan_address',
      },
    ],
  },
  {
    id: 'inter-eur',
    name: 'Wire Transfer EUR - Brasil',
    label: 'Wire Transfer - Euros (EUR - via Inter)',
    currency: 'EUR',
    flag: 'BR',
    icon: 'Globe',
    priority: 7,
    details: {
      type: 'Wire Transfer Internacional',
      destination: 'Banco Inter Brasil',
    },
    copyableFields: [
      {
        label: 'Titular',
        value: 'Marcelo Eyer Fernandes',
        field: 'name',
      },
      {
        label: 'IBAN',
        value: 'BR9600416968000010007524137C1',
        field: 'iban',
      },
      {
        label: 'Banco Intermediário',
        value: 'J.P.Morgan AG | SWIFT: CHASDEFX',
        field: 'intermediary',
      },
      {
        label: 'Banco Final',
        value: 'Banco Inter S.A. | SWIFT: ITEMBRSP',
        field: 'final_bank',
      },
      {
        label: 'Endereço Banco Inter',
        value: '1219 Barbacena Ave, Belo Horizonte, MG, 30190-924, Brazil',
        field: 'address',
      },
    ],
  },
  {
    id: 'inter-gbp',
    name: 'Wire Transfer GBP - Brasil',
    label: 'Wire Transfer - Libras (GBP - via Inter)',
    currency: 'GBP',
    flag: 'BR',
    icon: 'Globe',
    priority: 8,
    details: {
      type: 'Wire Transfer Internacional',
      destination: 'Banco Inter Brasil',
    },
    copyableFields: [
      {
        label: 'Titular',
        value: 'Marcelo Eyer Fernandes',
        field: 'name',
      },
      {
        label: 'IBAN',
        value: 'BR9600416968000010007524137C1',
        field: 'iban',
      },
      {
        label: 'Banco Intermediário',
        value: 'JPMORGAN CHASE BANK N.A., LONDON BRANCH | SWIFT: CHASGB2L',
        field: 'intermediary',
      },
      {
        label: 'Conta Intermediária',
        value: 'DE63501108006160005457',
        field: 'intermediate_account',
      },
      {
        label: 'Banco Final',
        value: 'JP Morgan AG | SWIFT CHASDEFX',
        field: 'final_bank',
      },
    ],
  },
];
