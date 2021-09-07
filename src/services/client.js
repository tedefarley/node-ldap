require('dotenv').config()
const { Client } = require('ldapts')

const ad3Client = (options) => {
    // if (options.url) {
    //     const ldapURL = options.url
    // }
    // if (options.ssl && !options.url) {
    //     const ldapURL = `ldaps://${process.env.DOMAIN_CONTROLLER}:${process.env.LDAP_PORT}`        
    // }
    // else {
    //     const ldapURL = `ldap://${process.env.DOMAIN_CONTROLLER}:${process.env.LDAP_PORT}`
    // }

    const ldapAD3 = new Client({
        url: process.env.AD3_LDAP_URL
    })

    return ldapAD3
}

const ouClient = (options) => {
    // if (options.url) {
    //     const ldapURL = options.url
    // }
    // if (options.ssl && !options.url) {
    //     const ldapURL = `ldaps://${process.env.DOMAIN_CONTROLLER}:${process.env.LDAP_PORT}`        
    // }
    // else {
    //     const ldapURL = `ldap://${process.env.DOMAIN_CONTROLLER}:${process.env.LDAP_PORT}`
    // }

    const ldapOU = new Client({
        url: process.env.OU_LDAP_URL,
        tlsOptions: {
            rejectUnauthorized: false
        }
    })

    return ldapOU
}

module.exports = { ad3: ad3Client(), ou: ouClient() }