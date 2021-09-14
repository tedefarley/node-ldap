const ldap = require('./ldapClient')
const config = require('../config/config')
const { Attribute, Change } = require('ldapts')

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
    const ouClient = await ldap.createClient()

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

    try {
        const ad3Result = await ad3Client.search(config.AD3_USERS_BASE, options)
        const ouResult = await ouClient.search(config.OU_GROUPS_BASE, options)

        return ad3Result.searchEntries[0]['objectGUID;binary'].toString('hex') 
        || ouResult.searchEntries[0]['objectGUID;binary'].toString('hex')
    } catch (err) {
        ad3Client.unbind()
        ouClient.unbind()
        throw err
    } finally {
        ad3Client.unbind()
        ouClient.unbind()
    }
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

    const searchOptions = options || {
        ...options,
        filter: `(cn=${user})`
    }

    /**
     * Client search method.
     * @param {string} - Search base.
     * @param {object} options - Search scope and filters.
     */
    try {
        const { searchEntries } = await client.search(config.AD3_USERS_BASE, searchOptions)
        console.log(searchEntries[0])
        return searchEntries[0]
    } catch (err) {
        client.unbind()
        throw err
    } finally {
        client.unbind()
    }
}

const getADGroup = async (group, options) => {
    const client = await ldap.createClient('ou')

    const searchOptions = options || {
        ...options,
        filter: `(cn=${group})`
    }

    /**
     * Client search method.
     * @param {string} - Search base.
     * @param {object} options - Search scope and filters.
     */
    try {
        const { searchEntries } = await client.search(config.OU_GROUPS_BASE, searchOptions)
        console.log(searchEntries[0])
        return searchEntries[0]
    } catch (err) {
        client.unbind()
        throw err
    } finally {
        client.unbind()
    }
}

const getADGroupMembers = async (groupName) => {
    const group = await getADGroup(groupName)
    return group.member
}

// const getADUserEmail = async (userName) => {
//     const user = await getADUser(userName)
//     return user.mail
// }

/**
 * Adds a member or members to a specified group.
 * @param {String[]} memberNames - Names of members.
 * @param {string} groupName - Group in which to add members.
 * @param {Object} options - (Optional) An object with options
 */
const addMembersToGroup = async (memberNames, groupName) => {
    const group = await getADGroup(groupName)
    debugger
    const members = await Promise.all(memberNames.map((memberNames) => getADUser(memberNames) || getADGroup(memberNames)))
    const memberDNs = members.map((member) => member.dn)

    console.log(members)
    console.log(memberDNs)

    const client = await ldap.createClient('ou')

    const change = new Change({
        operation: 'add',
        modification: new Attribute({
            type: 'member',
            values: memberDNs            
        }),
    })

    console.log(change)

    try {
        await client.modify(group.dn, change)
    } catch (err) {
        client.unbind()
        throw err
    } finally {
        client.unbind()
    }
}

/**
 * Adds a member or members to a specified group.
 * @param {String[]} memberNames - Names of members.
 * @param {string} groupName - Group in which to add members.
 * @param {Object} options - (Optional) An object with options
 */
 const removeMembersFromGroup = async (memberNames, groupName) => {
    const group = await getADGroup(groupName)
    // if(Array.isArray(memberNames)) {
        const members = await Promise.all(memberNames.map((memberNames) => getADUser(memberNames) || getADGroup(memberNames)))
        const memberDNs = members.map((member) => member.dn)
    // } else if(typeof memberNames == 'string') {
    //     const members = await getADUser(memberNames) || await getADGroup(memberNames)
    //     const memberDNs = members.dn
    // } else {
    //     throw new Error({
    //         Error: 'Type Error',
    //         message: `Unhandled argument type: ${typeof memberNames}`
    //     })
    // }

    const client = await ldap.createClient('ou')

    const change = new Change({
        operation: 'delete',
        modification: new Attribute({
            type: 'member',
            values: memberDNs            
        }),
    })

    try {
        await client.modify(group.dn, change)
    } catch (err) {
        client.unbind()
        throw err
    } finally {
        client.unbind()
    }
}

const createADGroup = async (groupName, options) => {
    const client = await client.createClient('ou')

    const groupDN = `CN=${groupName.toUpperCase},${config.OU_TEST_BASE}`
    const groupOptions = options || {
        ...options,
        cn: groupName.toUpperCase(),
        objectClass: ['top', 'group'],
        description: 'Group created by AD web service',
        samaccountname: groupName.toUpperCase(),
        objectCategory: 'CN=Group,CN=Schema,CN=Configuration,DC=ad3,DC=ucdavis,DC=edu',
        groupType: '-2147483640'
    }

    try{
        await client.add(groupDN, groupOptions)                
    } catch (err) {
        client.unbind()
        throw err
    } finally {
        client.unbind()
    }
}

const deleteADGroup = async (groupName) => {
    const client = await client.createClient('ou')

    const member = await getADGroup(cname)

    try{
        await client.del(member)                
    } catch (err) {
        client.unbind()
        throw err
    } finally {
        client.unbind()
    }
}

module.exports = {
    getGUID,
    getADUser,
    getADGroup,
    getADGroupMembers,
    addMembersToGroup,
    removeMembersFromGroup,
    createADGroup,
    deleteADGroup
}