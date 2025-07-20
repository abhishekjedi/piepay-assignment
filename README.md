**Backend Developer Take Home Assignment**

Overview

This project implements a backend service for processing and serving Flipkart offer data in response to the provided Flipkart Payment Options API response JSON.

Tech Stack

Language: TypeScript

Runtime: Node.js

Framework: Express.js

ORM: Prisma

Database: MySQL

Tools: ts-node-dev, dotenv

Setup & Run Instructions

Clone the Repository
git clone git@github.com:abhishekjedi/piepay-assignment.git
cd piepay-assignment

Install Dependencies
npm install

Configure Environment Variables

Create a .env file in the root directory and define the following:
DATABASE_URL=mysql://user:password@localhost:3306/dbname
PORT=3000

Setup Database
npx prisma migrate dev --name init
npx prisma generate

Start the Server
yarn dev

API Endpoints

POST /offer

Description: Accepts the Flipkart API JSON and extracts, transforms, and stores offers in the database.

Request: JSON body (full Flipkart response)

Response:
{
"noOfOffersIdentified": 2,
"noOfNewOffersCreated": 1
}

GET /highest-discount

Description: Calculates the best discount applicable for the given amount from the stored offers.

Response:
{
    "highestDiscountAmount": 375
}

Design Decisions

**Data Deduplication**

**Offers are uniquely identified by their adjustmentId.**

Only new offers are inserted; existing adjustmentIds are ignored.

**Unique constraint on adjustmentId in the database ensures deduplication.**

**Discount Parsing Strategy**

**Uses regex-based extraction to parse offer.summary strings for:**

**Percentage cashback (e.g., 5%)**

**Maximum cap (e.g., ₹750)**

**Flat cashback (e.g., Flat ₹10)**

Only the first payment instrument and bank are considered per offer.

**Assumes offer summaries are consistent in format.**

Prisma Client Usage

**Prisma client** is implemented as a **singleton** to avoid multiple database connections.

PrismaDBClient class provides **generic insertMany, and findMany** methods to support various models.

Typescript Design

All code is written in **TypeScript** with strict **type support.**

**Models and controller logic are modular** and reusable.

Project Structure

<img width="279" height="771" alt="image" src="https://github.com/user-attachments/assets/40966301-8a7d-46e8-9472-7df77d7813a7" />


How to Test

**Use any REST client like Postman or curl:**

get highest discount curl
```
curl --location 'http://localhost:3000/highest-discount?amountToPay=7500&bankName=FLIPKARTAXISBANK&paymentInstrument=CREDIT' \
--data ''
```

curl to post offer
```
curl --location 'http://localhost:3000/offer' \
--header 'Content-Type: application/json' \
--data '{
  "flipkartOfferApiResponse": {
    "response_status": "SUCCESS",
    "messages": [],
    "notify_messages": [
        {
            "title": "Please ensure your card can be used for online transactions. ",
            "type": "TEXT"
        },
        {
            "title": "Know More",
            "type": "OVERLAY_LINK",
            "url": "/api/v1/info/rbi"
        }
    ],
    "response_type": "PAYMENT_OPTIONS",
    "token_version": "v3",
    "disable_pay_button": false,
    "disable_pay_timeout": 0,
    "options": [
        {
            "applicable": true,
            "selected": true,
            "payment_instrument": "UPI",
            "display_text": "UPI",
            "messages": [
                {
                    "type": "INFO",
                    "message": "Pay by any UPI app"
                }
            ],
            "status_code": "",
            "section": "OTHERS",
            "priority": 0,
            "provider": "FLIPKART",
            "information": {
                "logo_urls": {
                    "primary": "https://static-assets-web.flixcart.com/fk-p-linchpin-web/batman-returns/logos/UPI.gif"
                }
            }
        },
        {
            "applicable": true,
            "selected": false,
            "payment_instrument": "CREDIT",
            "display_text": "Credit / Debit / ATM Card",
            "messages": [
                {
                    "type": "INFO",
                    "message": "Add and secure cards as per RBI guidelines"
                }
            ],
            "status_code": "",
            "section": "OTHERS",
            "priority": 1,
            "provider": "FLIPKART",
            "information": {}
        },
        {
            "applicable": true,
            "selected": false,
            "payment_instrument": "NET_OPTIONS",
            "display_text": "Net Banking",
            "messages": [
                {
                    "type": "INFO",
                    "message": "This instrument has low success, use UPI or cards for better experience"
                }
            ],
            "status_code": "",
            "section": "OTHERS",
            "priority": 2,
            "provider": "FLIPKART",
            "information": {}
        },
        {
            "applicable": true,
            "selected": false,
            "payment_instrument": "EGV",
            "display_text": "Gift Card",
            "messages": [],
            "status_code": "",
            "status_message": "",
            "section": "NEW_VOUCHERS",
            "priority": 3,
            "information": {},
            "redeemed": 0,
            "egv_payments": []
        },
        {
            "applicable": false,
            "selected": false,
            "payment_instrument": "EMI_OPTIONS",
            "display_text": "EMI (Easy Installments)",
            "messages": [
                {
                    "type": "ERROR",
                    "message": "Sorry, EMI is currently not available for payments less than Rs. 1000",
                    "status_code": "NOT_APPLICABLE"
                }
            ],
            "status_code": "MIN_EMI_AMOUNT_NOT_REACHED",
            "status_message": "Sorry, EMI is currently not available for payments less than Rs. 1000.",
            "section": "OTHERS",
            "priority": 2147483647,
            "provider": "FLIPKART",
            "information": {}
        },
        {
            "applicable": false,
            "selected": false,
            "payment_instrument": "COD",
            "display_text": "Cash on Delivery",
            "messages": [
                {
                    "type": "ERROR",
                    "message": "Cash on Delivery(CoD) is not available for this order. It may not be supported for the product or selected area, or because of recent account activity.",
                    "status_code": "NOT_APPLICABLE"
                }
            ],
            "status_code": "NOT_AVAILABLE",
            "status_message": "",
            "section": "OTHERS",
            "priority": 2147483647,
            "information": {},
            "callout": {}
        }
    ],
    "price_summary": {
        "remaining": 27400,
        "base_price": 27000,
        "item_count": 1,
        "convertible_amount": [],
        "price_details": [
            {
                "key": "PRICE",
                "value": 27000,
                "item_count": 1,
                "convertible_amount": []
            }
        ],
        "breakup": [
            {
                "key": "packaging_charges",
                "display_text": "Packaging Charges",
                "value": 0,
                "type": "DEFAULT"
            },
            {
                "key": "pickup_charges",
                "display_text": "Pickup Charges",
                "value": 0,
                "type": "DEFAULT"
            },
            {
                "key": "platform_fee",
                "display_text": "Platform Fee",
                "value": 400,
                "type": "DEFAULT"
            }
        ],
        "you_pay": [
            {
                "key": "AMOUNT_PAYABLE",
                "value": 27400,
                "item_count": 0,
                "convertible_amount": []
            }
        ],
        "notify_messages": []
    },
    "sla_summary": {
        "prepaid": 1753009014965,
        "postpaid": 1753009014965
    },
    "reservation_details": [
        {
            "reservationStatus": "RESERVED",
            "presentTs": 1753009014965,
            "ttl": 1753009854464,
            "message": "You have time till July 20,2025,04:40:54 PM to complete your order."
        }
    ],
    "reservation_expiry_action": {
        "url": "https://1.rome.api.flipkart.com/api/3/checkout/pgCancelResponse/desktop?redirect_domain=https://www.flipkart.com&callback=true",
        "target": "https://1.rome.api.flipkart.com/api/3/checkout/pgCancelResponse/desktop?redirect_domain=https://www.flipkart.com&callback=true",
        "action_type": "EXTERNAL_REDIRECTION",
        "http_method": "POST",
        "parameters": {
            "reason_code": "RESERVATION_EXPIRED",
            "merchant_transaction_id": "OD3349864321926621-TX-00",
            "transaction_status": "FAILED"
        }
    },
    "back_action": {
        "url": "https://1.rome.api.flipkart.com/api/3/checkout/pgCancelResponse/desktop?redirect_domain=https://www.flipkart.com&callback=true",
        "target": "https://1.rome.api.flipkart.com/api/3/checkout/pgCancelResponse/desktop?redirect_domain=https://www.flipkart.com&callback=true",
        "action_type": "EXTERNAL_REDIRECTION",
        "http_method": "POST",
        "parameters": {
            "reason_code": "CANCELLED_BY_USER",
            "merchant_transaction_id": "OD3349864321926621-TX-00",
            "transaction_status": "FAILED"
        }
    },
    "offer_banners": [
        {
            "adjustment_sub_type": "PBO",
            "adjustment_id": "FPO250619134128USHPF",
            "summary": "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter",
            "contributors": {
                "payment_instrument": [
                    "CREDIT"
                ],
                "banks": [
                    "FLIPKARTAXISBANK"
                ],
                "emi_months": [
                    "0"
                ],
                "card_networks": []
            },
            "display_tags": [
                "PAYMENT_OPTIONS"
            ],
            "image": "https://img1a.flixcart.com/www/linchpin/fk-cp-pay/axis-78501b36.svg",
            "type": {
                "value": "non-collapsable"
            }
        },
        {
            "adjustment_sub_type": "PBO",
            "adjustment_id": "FPO250619135528ZQIZW",
            "summary": "5% cashback on Axis Bank Flipkart Debit Card up to ₹750",
            "contributors": {
                "payment_instrument": [
                    "CREDIT"
                ],
                "banks": [
                    "FLIPKARTAXISBANK"
                ],
                "emi_months": [
                    "0"
                ],
                "card_networks": []
            },
            "display_tags": [
                "PAYMENT_OPTIONS"
            ],
            "image": "https://img1a.flixcart.com/www/linchpin/fk-cp-pay/axis-78501b36.svg",
            "type": {
                "value": "non-collapsable"
            }
        }
    ],
    "offer_sections": {
        "PBO": {
            "title": "Partner offers",
            "offers": [
                {
                    "adjustment_type": "CASHBACK_ON_CARD",
                    "adjustment_id": "FPO250619134128USHPF",
                    "summary": "5% cashback on Flipkart Axis Bank Credit Card upto ₹4,000 per statement quarter",
                    "contributors": {
                        "payment_instrument": [
                            "CREDIT"
                        ],
                        "banks": [
                            "FLIPKARTAXISBANK"
                        ],
                        "emi_months": [
                            "0"
                        ],
                        "card_networks": []
                    },
                    "display_tags": [
                        "PAYMENT_OPTIONS"
                    ],
                    "image": "https://img1a.flixcart.com/www/linchpin/fk-cp-pay/axis-78501b36.svg"
                },
                {
                    "adjustment_type": "CASHBACK_ON_CARD",
                    "adjustment_id": "FPO250619135528ZQIZW",
                    "summary": "5% cashback on Axis Bank Flipkart Debit Card up to ₹750",
                    "contributors": {
                        "payment_instrument": [
                            "CREDIT"
                        ],
                        "banks": [
                            "FLIPKARTAXISBANK"
                        ],
                        "emi_months": [
                            "0"
                        ],
                        "card_networks": []
                    },
                    "display_tags": [
                        "PAYMENT_OPTIONS"
                    ],
                    "image": "https://img1a.flixcart.com/www/linchpin/fk-cp-pay/axis-78501b36.svg"
                }
            ]
        }
    },
    "merchant_id": "mp_flipkart",
    "section_details": {
        "PREFERRED": {
            "visible_options_count": 3
        },
        "OTHERS": {
            "visible_options_count": 10
        },
        "NEW_VOUCHERS": {
            "visible_options_count": 1
        },
        "LINKED_VOUCHERS": {
            "visible_options_count": 1
        }
    }
}
}'
```


Edge Cases Handled

Server won't crash on bad input; errors are caught and logged.

Silent Prisma crashes are handled using uncaughtException and unhandledRejection handlers.

Empty or malformed Flipkart data results in 0 offers created.

Flat cashback and percent cashback with cap both supported in discount calculation.




