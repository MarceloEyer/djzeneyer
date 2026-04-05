import { ARTIST } from './artistData';

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

const brl = ARTIST.payment.interGlobal.brazil;
const usd = ARTIST.payment.interGlobal.usd;

export const paymentMethods: PaymentMethod[] = [
    {
        id: 'pix',
        type: 'pix',
        titleKey: 'payme.methods.pix.title',
        descriptionKey: 'payme.methods.pix.desc',
        category: 'both',
        details: [
            { labelKey: 'payme.fields.pix_key', value: brl.pixKey, copyable: true },
            { labelKey: 'payme.fields.name', value: brl.accountName, copyable: false }
        ]
    },
    {
        id: 'inter-brl',
        type: 'bank',
        titleKey: 'payme.methods.inter_brl.title',
        descriptionKey: 'payme.methods.inter_brl.desc',
        category: 'both',
        details: [
            { labelKey: 'payme.fields.bank', value: brl.bank, copyable: false },
            { labelKey: 'payme.fields.agency', value: brl.branch, copyable: true },
            { labelKey: 'payme.fields.account', value: brl.account, copyable: true },
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
            { labelKey: 'payme.fields.link', value: ARTIST.payment.paypal.me, copyable: true }
        ]
    },
    {
        id: 'wire-usd',
        type: 'wire',
        titleKey: 'payme.methods.wire_usd.title',
        descriptionKey: 'payme.methods.wire_usd.desc',
        category: 'contractor',
        details: [
            { labelKey: 'payme.fields.swift', value: usd.wireRouting, copyable: true },
            { labelKey: 'payme.fields.routing', value: usd.achRouting, copyable: true },
            { labelKey: 'payme.fields.account', value: usd.accountNumber, copyable: true }
        ]
    }
];
