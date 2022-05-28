const Joi = require("joi");

const signupService = require("../../services/clients/signup.service");


const signupDataValidate = (data) => {
    // Validate locataire schema
    const validationSchema = Joi.object({
        num : Joi.string().required(),
        name: Joi.string().min(3).max(255).required(),
        family_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().max(255).required(),
        phone_number: Joi.string().required(),
        password: Joi.string().min(8).max(255).required(),
    });
    return validationSchema.validate(data)
}

/*
* HTTP codes
* 201: Resource created
* */

const signup = async (req, res) => {

    // Validate user supplied data
    const { error } = signupDataValidate(req.body);
    if (error) {
        // Bad request
        return res.status(400).json({
            errors: [{ msg: error.details[0].message }]
        });
    }

    // Extract validated data from body
    const {
        num,
        name,
        family_name,
        email,
        phone_number,
        password,
    } = req.body;

    const { code, data} = await signupService.signup(num, name, family_name, email, phone_number, password)
    return  res.status(code).json(data)

}

module.exports = {
    signup
}