const Joi = require('joi')
const bcrypt = require('bcrypt')
const saltRounds = 10;


const plugin = {
    name: 'usersController',
    version: '1.0.0',
    register: (server, options) => {
        server.route([
            {
                method: 'GET',
                path: '/register',
                handler: getAllType
            },

            {
                method: ['POST'],
                path: '/post',
                options: {
                    validate: {
                        payload: {
                            name: Joi.string().min(3).max(30).required(),
                            username: Joi.string().min(3).max(50).required(),
                            email: Joi.string().email().required(),
                            password: Joi.string().min(3).max(50).required(),
                            id: Joi.required(),

                        }
                    }
                },
                handler: createUser
            },
            {
                method: ['POST'],
                path: '/validate-login',
                options: {
                    validate: {
                        payload: {
                            username: Joi.string().min(3).max(50).required(),
                            password: Joi.string().min(3).max(50).required(),
                        }
                    }
                },
                handler: validateUser
            }
        ])
    }
}

async function getAllType(req, h) {
    try {
        return await h.act({ role: 'users', cmd: 'getTypeall' })
    } catch (error) {
        console.error(error)
    }
}

async function createUser(req, h) {
    try {
        const payload = { args: req.payload }
        const passwordEncrypt = bcrypt.hashSync(req.payload.password, saltRounds);
        payload.args.password = passwordEncrypt;
        return await h.act({ role: 'users', cmd: 'addUsers' }, payload)
    } catch (error) {
        console.error(error)
    }
}

async function validateUser(req, h) {
    try {
        const payload = { args: req.payload}
        //console.log(payload)
        return await h.act({ role:'users', cmd: 'login'}, payload)
    } catch (error) {
        console.error(error)
    }
}

module.exports = plugin