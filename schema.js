const Joi = require('joi');

// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         price: Joi.number().required().min(0), //Price should not be negative.
//         country: Joi.string().required(),
//         image: Joi.object({
//             url: Joi.string().required(),
//             filename: Joi.string().required(),
//           }),
//     }).required()
// });


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0), //Price should not be negative.
        country: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().allow('', null).required(),
            url: Joi.string().allow('', null).required()
        }).required()
    }).required()
});