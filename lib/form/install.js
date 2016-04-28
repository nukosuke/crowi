'use strict';

var form = require('express-form')
  , field = form.field
  , register = require('./register');

module.exports = function(req, res, next) {
  // LDAPを使うにチェックが入っている時
  if (req.body.registerForm.useLdap === 'true') {
    form(
      field('registerForm.ldapHost').required(), //TODO regex
      field('registerForm.ldapBindDn').required(), //TODO regex
      field('registerForm.ldapPassword').required(),
      // 文字数などの制限はLDAP側に依存するのでここではrequiredのみ行う
      field('registerForm.username').required(),
      field('registerForm.name').required(),
      field('registerForm.email').required(),
      field('registerForm.password').required(),
      field('registerForm.fbId').isInt(),
      field('registerForm.googleId').isInt()
    )(req, res, next);
  } else {
      register(req, res, next);
  }
};