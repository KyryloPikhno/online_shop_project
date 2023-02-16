import Joi from "joi";

import {regexp} from "../configs";


const brandValidator = Joi.object({
    brand: Joi.string().regex(regexp.NAME).messages({
        'brand.pattern.base': 'Brand is required'
    })
});

export {brandValidator}