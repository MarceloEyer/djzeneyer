export interface PaymentMethod {
    id: string;
    type: 'pix' | 'bank' | 'paypal' | 'wire';
    titleKey: string;
    descriptionKey: string;
    details: {
        labelKey: string;
        value: string;
        copyable?: boolean;
    }[];
    category: 'donor' | 'contractor' | 'both';
}

export const paymentMethods: PaymentMethod[] = [
    {
        id: 'pix',
        type: 'pix',
        titleKey: 'payme.methods.pix.title',
        descriptionKey: 'payme.methods.pix.desc',
        category: 'both',
        details: [
            { labelKey: 'payme.fields.pix_key', value: 'djzeneyer@gmail.com', copyable: true },
            { labelKey: 'payme.fields.name', value: 'Marcelo Eyer', copyable: false }
        ]
    },
    {
        id: 'inter-brl',
        type: 'bank',
        titleKey: 'payme.methods.inter_brl.title',
        descriptionKey: 'payme.methods.inter_brl.desc',
        category: 'both',
        details: [
            { labelKey: 'payme.fields.bank', value: 'Banco Inter (077)', copyable: false },
            { labelKey: 'payme.fields.agency', value: '0001', copyable: true },
            { labelKey: 'payme.fields.account', value: '1234567-8', copyable: true },
            { labelKey: 'payme.fields.document', value: '***.***.***-**', copyable: true }
        ]
    },
    {
        id: 'paypal',
        type: 'paypal',
        titleKey: 'payme.methods.paypal.title',
        descriptionKey: 'payme.methods.paypal.desc',
        category: 'donor',
        details: [
            { labelKey: 'payme.fields.link', value: 'https://paypal.me/djzeneyer', copyable: true }
        ]
    },
    {
        id: 'wire-usd',
        type: 'wire',
        titleKey: 'payme.methods.wire_usd.title',
        descriptionKey: 'payme.methods.wire_usd.desc',
        category: 'contractor',
        details: [
            { labelKey: 'payme.fields.swift', value: 'INTERUS33', copyable: true },
            { labelKey: 'payme.fields.routing', value: '123456789', copyable: true },
            { labelKey: 'payme.fields.account', value: '987654321', copyable: true }
        ]
    }
];
