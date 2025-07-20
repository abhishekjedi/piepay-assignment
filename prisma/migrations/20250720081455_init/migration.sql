-- CreateTable
CREATE TABLE `Offer` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `paymentInstrument` VARCHAR(191) NOT NULL,
    `adjustmentId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Offer_adjustmentId_key`(`adjustmentId`),
    UNIQUE INDEX `Offer_title_bankName_paymentInstrument_key`(`title`, `bankName`, `paymentInstrument`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
