const Joi = require("joi");

const validateTask = async (data) => {
    const schema = Joi.object({
        title: Joi.string().required().min(3),
        description: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().min(Joi.ref("startDate")),
        priority: Joi.string().valid("low", "medium", "high"),
        status: Joi.string().valid("pending", "inProgress", "completed"),
        assignedTo: Joi.string().optional(),
    });
    return schema.validate(data);
};

const validateUser = async (data) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        role: Joi.string().valid("admin", "user").default("user"),
    });
    return schema.validate(data);
};

const validateLogin = async (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    });
    return schema.validate(data);
};

module.exports = {
    validateTask,
    validateUser,
    validateLogin,
};
