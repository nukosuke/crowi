'use strict';

var form = require('express-form')
  , field = form.field
  ;

module.exports = form(
  // usernameはLDAPからとってくる
  // email, passwordのみ必須
  // 文字数などの制限はLDAP側に依存するのでここではrequiredのみ行う
  field('registerForm.name'),
  field('registerForm.email').required(),
  field('registerForm.password').required(),
  field('registerForm.fbId').isInt(),
  field('registerForm.googleId').isInt()
);
