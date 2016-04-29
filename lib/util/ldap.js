/**
 * ldap utility
 * ref: http://ldapjs.org/client.html
 */
 
module.exports = function(crowi) {
    'use strict';
    
    var debug = require('debug')('crowi:lib:ldap'),
    Config = crowi.model('Config'),
    ldapjs = require('ldapjs'),
    ldap = {};
    ldap.client = undefined;
    
    ldap.createClient = function() {
        if (!ldap.client) {
            ldap.configureLdapClient();
        }
    };
    
    //TODO tls option when protocol is ldaps
    ldap.configureLdapClient = function() {
        var config = crowi.getCongig();
        
        ldap.client = ldapjs.createClient({
            url: config.crowi['ldap:host'],
        });
        
        ldap.client.bind(config.crowi['ldap:bindDn'], config.crowi['ldap:password'], function(err, res) {
            if (err) {
                debug('Failed to bind DN', err, res);
            }
        });
    };
    
    return ldap;
};