'use strict';

var form = require('express-form')
  , field = form.field
  ;

module.exports = form(
    field('ldapForm.host').required(), //TODO regex
    //field('ldapForm.port').required(),
    field('ldapForm.bindDn').required(), //TODO regex
    field('ldapForm.password').required()
);
