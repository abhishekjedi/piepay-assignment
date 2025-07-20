import express from 'express';
import { OffersController } from './offers.controller';

const router = express.Router();
const offersController = new OffersController();

router.post('/offer', offersController.saveOffers.bind(offersController));
router.get('/highest-discount', offersController.getHighestDiscount.bind(offersController));

export default router;