const ldap = require('./ldapClient')
const config = require('../config/config')

/**
 * @author Teddy Farley
 */

/**
 * Gets GUID from an AD object.
 * @param {string} cname - Name of the AD object you want to find.
 * @param {string} objectClass - Type of AD object in question.
 * @return {UUID} - Returns the GUID of the specified object.
 */
const getGUID = async (cname, objectClass) => {
    const ad3Client = await ldap.createClient('ad3')
    // const ouClient = await ldap.createClient()

    // if(objectClass == 'user') {

    // }
    // else if(objectClass == 'group') {

    // } else {
    //     throw new Error({ 
    //         Error: 'TypeError', 
    //         message: `Invalid objecct type: ${objectClass}`
    //     })
    // }

    const options = {
        scope: 'sub',
        filter: `cn=${cname}`,
        attributes: ['ObjectGUID;binary']
    }

    const ad3Result = ad3Client.search(config.AD_USERS_BASE, options)
    // const ouResult = ouClient.search(config.OU_GROUPS_BASE, options)

    return ad3Result.searchEntries[0]['objectGUID;binary'].toString('hex')
    // ouResult.searchEntries[0]['objectGUID;binary'].toString('hex')
}

/**
 * Searches Active Directory for specified user(s).
 * @param {string} user - CName of the user you want to return.
 * @param {Object} options (optional) - Object with additional options like scope and attributes.
 * options: {
 *      @param {string} scope - Scope of your search. e.x. 'sub', 'base', 'one'. 'sub' recursively searches all subfolders. 
 *      @param {Array} attributes - Returns only specified AD object attributes.
 * }
 * @return {Array} - Returns an array of users with specified attributes matching your search.
 */
const getADUser = async (user, options) => {
    const client = await ldap.createClient('ad3')
    // const defaultOptions = {
    //     scope: 'sub',
    //     filter: `(cn=${user})`,
    //     attributes: ['cn', 'dn', 'objectGUID']
    // }

    // if(!options) options = defaultOptions

    // const { filter, ...viableOptions} = options
    // const searchOptions = {
    //     ...viableOptions,
    //     filter: defaultOptions.filter
    // }

    const searchOptions = {
        ...options,
        filter: `(cn=${user})`
    }

    console.log(searchOptions)

    try {
        /**
         * Client search method.
         * @param {string} - Search base.
         * @param {object} options - Search scope and filters.
         */
        const {searchEntries} = await client.search(config.AD_USERS_BASE, searchOptions)
        console.log(searchEntries[0])
        return searchEntries[0]
    } catch (err) {
        throw err
    } finally {
        client.unbind()
    }
}

module.exports = {
    getGUID,
    getADUser
}