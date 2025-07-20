
export type Offer = {
    title: string;
    bankName: string;
    paymentInstrument: string;
    adjustmentId?: string;
};

export type FlipkartOffer = {
  summary: string;
  adjustment_id: string;
  contributors: {
    banks?: string[];
    payment_instrument?: string[];
  };
}

export type OfferSection = {
  title: string;
  offers: FlipkartOffer[]; // each item here is an individual offer
};
