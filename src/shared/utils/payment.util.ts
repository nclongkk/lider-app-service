import {
  PaymentAction,
  StripePaymentCurrencySupported,
} from 'src/constants/payment.constants';

export const convertToSmallestUnit = (
  amount: number,
  currency: StripePaymentCurrencySupported,
) => {
  switch (currency.toUpperCase()) {
    case StripePaymentCurrencySupported.USD:
      return amount * 100; // convert to cents
    case StripePaymentCurrencySupported.VND:
      return amount;
    default:
      return null;
  }
};

export const generateDescription = ({
  amount,
  currency,
  transactionId,
  paymentMethodId,
  campaignId,
  type,
  paymentType,
}: {
  amount: number;
  currency: string;
  transactionId: string;
  type: string;
  paymentType: string;
  paymentMethodId?: string;
  campaignId?: string;
}) => {
  let description;
  switch (type) {
    case PaymentAction.ACTIVE_CARD:
      description = `${amount.toLocaleString('en-US', {
        style: 'currency',
        currency,
      })} is paid via ${paymentType} with transaction ${transactionId} for card ${paymentMethodId}. Recorded by System.`;
      break;
    case PaymentAction.CHECKOUT_CAMPAIGN:
      description = `${amount.toLocaleString('en-US', {
        style: 'currency',
        currency,
      })} is paid via ${paymentType} with transaction ${transactionId} for campaign ${campaignId}. Recorded by System.`;
      break;
    default:
      description = `Payment with ${transactionId}`;
      break;
  }
  return description;
};
