'use strict';

const jsonwebtoken = require('jsonwebtoken');

module.exports = (joi) => ({
  name: 'jwt',
  base: joi.string(),
  language: {
    valid: 'is invalid',
    expired: 'has expired'
  },
  rules: [{
    name: 'valid',
    params: {
      options: joi.object({
        secret: joi.string(),
        expiration: joi.any()
      })
    },
    description: function (params) {
      return 'Token should be valid'
    },
    setup: function (params) {
      this._flags.secret = params.options.secret
    },
    validate: function (params, value, state, options) {
      if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/.test(value)) {
        return this.createError('jwt.valid', { value }, state, options);
      }

      let decoded;

      try {
        decoded = jsonwebtoken.verify(value, params.options.secret)
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return this.createError('jwt.expired', { value }, state, options)
        }

        return this.createError('jwt.valid', { value }, state, options)
      }

      return decoded;
    }
  }]
})
