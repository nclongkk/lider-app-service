export interface IFeeConfiguration {
  feePerMin: number;
  currency: string;
}

export const feeConfigurationFn = (): IFeeConfiguration => ({
  feePerMin: process.env.FEE_PER_MINUTE
    ? parseFloat(process.env.FEE_PER_MINUTE)
    : 0.02,
  currency: process.env.CURRENCY || 'USD',
});
