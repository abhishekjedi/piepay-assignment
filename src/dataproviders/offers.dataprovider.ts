import { Offer } from "@prisma/client";
import PrismaDBClient from "../db/prisma.client";

export default class OffersDP {
  private prismaClient: PrismaDBClient;

  constructor() {
    this.prismaClient = PrismaDBClient.getInstance();
  }

  async addOffer(data: Omit<Offer, 'id' | 'createdAt'>[]) {
    return this.prismaClient.insertMany('offer', {
        data,
        skipDuplicates: true, 
    });
  }

  async getOffersByBankAndInstrument(bankName: string, paymentInstrument?: string) {
    const where: any = { bankName };

    if (paymentInstrument) {
      where.paymentInstrument = paymentInstrument;
    }

    return this.prismaClient.findMany('offer', { where });
  }
}