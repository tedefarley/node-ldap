const v8 = require('./v8clone')
const config = require('../config/config')
const { Client } = require('ldapts')

/** 
* Initiates and returns a parametric ldap client.
* @author Teddy Farley
*
* @param {string} type - Denotes whether the client authenticates with the 'ou' or 'ad3' domain controller. Default 'ou'
* @param {object|string} options (optional) - Object with optional nested client parameters :
* options {
    * @param {string} host: - Default 'oudc14c.ou.ad3.ucdavis.edu'.
    * @param {int|string} port: - Default is undefined unless sll is enabled, in which default is 636.
    * @param {boolean} ssl: - Secures the connection using ssl if true. Default false.
    * @param {object} clientOptions - Options specified by 'ldapts' with the exeption of url.
    * clientOptions(e.x): {  
        timeout: 0, - Default infinity
        connectTimeout: 0,
        tlsOptions: {
            rejectUnauthorized: false
        },
        strictDN: true - Default true
    * }
    * @param {object} credentials - Credentials for if you are authenticating with an AD user.
    * credentials: {
        * @param {string} bindDN - DistinguishedName of the object you wish to bind.
        * @param {string} bindPass - Password if binding to a user for authentication. 
    * }
* }
* @return {Promise|Object} - Returns an ldap client based on specifications.
* 
*/
const createClient = async (type = 'ou', options) => {
    const newOptions = {
        host: config[`${type.toUpperCase()}_LDAP_HOST`],
        port: config.LDAP_PORT,
        ssl: true,
        clientOptions: {
            url: config[`${type.toUpperCase()}_LDAPS_URL`],
            tlsOptions: {
                rejectUnauthorized: false
            }
        },
        credentials: {
            bindDN: config.AD_USER,
            bindPass: config.AD_USER_PASS
        }
    }

    // Create a new client with params.
    const client = new Client(newOptions.clientOptions)

    // Bind if credentials are present.
    if(newOptions.credentials !== undefined) {
        try {
            await client.bind(newOptions.credentials.bindDN, newOptions.credentials.bindPass)
        } catch (err) {
            throw err
        }
        return client
    }
    
    return client
}

module.exports = {
    createClient
}