import { Request, Response } from "express";
import { OfferService } from "../../services/offers/offers.service";

export class OffersController {
    offersService: OfferService;

    constructor() {
        this.offersService = new OfferService();
    }

    public async saveOffers(req: Request, res: Response) {
        try {
            const response = req.body.flipkartOfferApiResponse;
            if(!response || typeof response !== 'object') {
                return res.status(400).json({
                    message: 'Invalid or missing flipkartOfferApiResponse',
                    statusCode: 400,
                    status: 'error'
                });
            }
            const result = await this.offersService.saveOffersFromFlipkartResponse(response);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Error saving offers:', error);
            res.status(500).json({
                message: 'Failed to save offers',
                error: error instanceof Error ? error.message : 'Unknown error',
                statusCode: 500,
                status: 'error'
            });
        }
    }

    public async getHighestDiscount(req: Request, res: Response) {
        try {
            const amountToPay = parseFloat(req.query.amountToPay as string);
            const bankName = req.query.bankName as string;
            const paymentInstrument = req.query.paymentInstrument as string | undefined;

            if (isNaN(amountToPay) || !bankName) {
                return res.status(400).json({ message: 'amountToPay and bankName are required' });
            }

            const result = await this.offersService.getHighestDiscount(amountToPay, bankName, paymentInstrument);

            return res.status(200).json(
                result
            );
        } catch (error) {
            console.error('Failed to calculate discount:', error);
            res.status(500).json({
                message: 'Failed to calculate discount',
                error: error instanceof Error ? error.message : 'Unknown error',
                statusCode: 500,
                status: 'error'
            });
        }

    }
}