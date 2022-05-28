
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const joi = require('Joi')
const loginService = require("../../services/clients/login.service")



const loginValidation = (data) => {
	const validationSchema = new joi.object({
		email: joi.string().email().required().max(255),
		password: joi.string().required().min(8).max(255),
	});
	return validationSchema.validate(data);
};

const login = async (req, res) => {
	// get the body of the request => validation
	const { error } = await loginValidation(req.body);
	if (error)
		return res
			.status(400)
			.json({ success: false, errors: [{ msg: error.details[0].message }] });

	const { email, password } = req.body;
	const { code, data } = await loginService.login(email, password)
	return res.status(code).json(data);
};


module.exports = {
    login
}