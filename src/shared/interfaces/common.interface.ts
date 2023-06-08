export interface ICountry {
  code: string;
  name: string;
  dialCode: string;
  currencyCode: string;
  flag: string;
}

export interface IProvince {
  id: number;
  level: number;
  name: string;
  countryCode: string;
  parentId: number;
}
export interface ILocation {
  id: number;
  level: number;
  name: string;
  countryCode: string;
  parentId?: number;
}
export interface IIndustry {
  name: string;
  description?: string;
}

export interface ICategory {
  id: number;
  name: string;
  description?: string;
}

export interface ILanguage {
  name: string;
  code: string;
}

export interface ITimezone {
  code: string;
  time: string;
}

export interface ICampaignPlan {
  name: string;
  description: string;
  price: number;
  currency: string;
  features: [
    {
      name: string;
      price: number;
    },
  ];
}

export const enum UserStep {
  step1 = 'step1',
  step2 = 'step2',
  step3 = 'step3',
  step4 = 'step4',
}
export interface IUserStep {
  [UserStep.step1]: {
    brandId: string;
  };
  [UserStep.step2]: {
    productIds: string[];
  };
  [UserStep.step3]: {
    campaignId: string;
  };
  [UserStep.step4]: {
    campaignId: string;
  };
  currentStep: UserStep;
}

export interface ILog {
  action: string;
  userId: string;
  dateTime?: string;
  data?: any;
}
