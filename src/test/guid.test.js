const { Client } = require('ldapts')
const config = require('../config/config')

const getGUID = async (obj) => {
    const defaultOptions = {
        url: config.AD3_LDAPS_URL,
        tlsOptions: {
            rejectUnauthorized: false
        }
    }

    const client = new Client(defaultOptions)
    await client.bind(config.AD_USER, config.AD_USER_PASS)

    const searchOptions = {
        base: config.AD_USERS_BASE,
        options: {
            scope: 'sub',
            filter: `(cn=${obj})`,
            attributes: ['objectGUID;binary']
        }
    }

    const { searchEntries } = await client.search(searchOptions.base, searchOptions.options)
    client.unbind()

    console.log(searchEntries[0])
    return searchEntries[0]
}

getGUID('tefarley')