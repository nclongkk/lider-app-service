export const OTP_STRIPE_CARD_EXPIRED = 60 * 60; // 1 hour

export const STRIPE_ACTIVE_CARD_FEE = Number(
  process.env.STRIPE_ACTIVE_CARD_FEE || 0.5,
);

export enum StripeCountry {
  SINGAPORE = 'SGD',
  MALAYSIA = 'MYR',
}

export enum PaymentMethod {
  STRIPE = 'Card',
  PAYPAL = 'PayPal',
}

export enum StripeCaptureMethod {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
}

export enum PaymentIntentMethod {
  CAPTURE = 'capture',
  CONFIRM = 'confirm',
}

export const enum StripePaymentCurrencySupported {
  USD = 'USD',
  VND = 'VND',
}

export enum PaypalMode {
  SANDBOX = 'sandbox',
  LIVE = 'live',
}

export enum StripeCardStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
}

export enum PaymentAction {
  CHECKOUT_CAMPAIGN = 'checkout_campaign',
  ACTIVE_CARD = 'active_card',
}

export enum PaymentStatus {
  SUCCEEDED = 'done',
  FAILED = 'rejected',
  PENDING = 'pending',
  INCOMPLETE = 'incomplete',
}
