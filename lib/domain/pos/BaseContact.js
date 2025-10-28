const Joi = require('joi');

/**
 * Base schema for contact details with common fields.
 * This serves as the foundation for all contact types in Barion.
 */
const baseContactSchema = Joi.object({
    PhoneNumber: Joi.string().required()
        .max(30),
    Email: Joi.string().required()
        .email()
});

/**
 * Creates a contact schema with a required Name field.
 * Used for contacts that require a name (Business and Technical contacts).
 */
const namedContactSchema = baseContactSchema.keys({
    Name: Joi.string().required()
});

module.exports = {
    baseContactSchema,
    namedContactSchema
};
