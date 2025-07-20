import { Offer } from "@prisma/client";
import { FlipkartOffer, OfferSection } from "../../common/types/types";
import OffersDP from "../../dataproviders/offers.dataprovider";

export class OfferService {
    private offersDP: OffersDP;

    constructor() {
        this.offersDP = new OffersDP();
    }

    public async saveOffersFromFlipkartResponse(response: any) {
        const offerSections: OfferSection[] = response?.offer_sections || {};
        const allOffers: FlipkartOffer[] = [];

        // Collect offers from all sections
        for (const section of Object.values(offerSections)) {
            if (Array.isArray(section.offers)) {
                allOffers.push(...section.offers);
            }
        }

        const noOfOffersIdentified = allOffers.length;

        if (!noOfOffersIdentified) {
            return { noOfOffersIdentified: 0, noOfNewOffersCreated: 0 };
        }

        const prepared: Omit<Offer, 'id' | 'createdAt'>[] = allOffers.map((offer) => ({
            title: offer.summary,
            adjustmentId: offer.adjustment_id || null,
            bankName: offer.contributors.banks?.[0] || '',
            paymentInstrument: offer.contributors.payment_instrument?.[0] || '',
        }));

        const result = await this.offersDP.addOffer(
            prepared
        );

        return {
            noOfOffersIdentified,
            noOfNewOffersCreated: result.count, // Prisma returns count of inserted rows
        };
    }

    public async getHighestDiscount(amountToPay: number, bankName: string, paymentInstrument?: string) {
        const offers = await this.offersDP.getOffersByBankAndInstrument(bankName, paymentInstrument);

        let maxDiscount = 0;

        for (const offer of offers) {
            const title = offer.title;

            // Match % cashback (e.g., 5%)
            const percentageMatch = title.match(/(\d+)%/);
            const percent = percentageMatch ? parseFloat(percentageMatch[1]) : 0;

            // Match cap (e.g., up to ₹750)
            const capMatch = title.match(/up to ₹?([\d,]+)/i);
            const cap = capMatch ? parseInt(capMatch[1].replace(/,/g, '')) : Infinity;

            // Match flat cashback (e.g., Flat ₹10)
            const flatMatch = title.match(/Flat ₹?([\d,]+)/i);
            const flat = flatMatch ? parseInt(flatMatch[1].replace(/,/g, '')) : 0;

            // Calculate discount
            let discount = 0;
            if (flat) {
                discount = flat;
            } else if (percent > 0) {
                discount = Math.min((amountToPay * percent) / 100, cap);
            }

            maxDiscount = Math.max(maxDiscount, discount);
        }

        return {
            highestDiscountAmount: Math.floor(maxDiscount),
        };
    }
};