const Joi = require('@hapi/joi');

/**
 * This structure represents payee transaction included in a payment transaction.
 * These are e-money sub-transactions that are executed after the payment was fully completed.
 * Payee transactions can be used to transfer royalties, agent fees or such to a third party, 
 * or to distribute the amount paid by the payer to multiple Barion wallets. 
 * 
 * @see {@link https://docs.barion.com/PayeeTransaction|Barion API Documentation}
 */
const schema = Joi.object({
    POSTransactionId: Joi.string().required(),
    Payee: Joi.string().required()
        .email(),
    Total: Joi.number().required()
        .greater(0),
    Comment: Joi.string().optional()
        .max(640)
})
    .unknown()
    .rename(/^POSTransactionId$/i, 'POSTransactionId', { override: true })
    .rename(/^Payee$/i, 'Payee', { override: true })
    .rename(/^Total$/i, 'Total', { override: true })
    .rename(/^Comment$/i, 'Comment', { override: true });

module.exports = schema;
