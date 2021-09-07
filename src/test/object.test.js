require('dotenv').config()
const config = require('./src/config/config')
const obj0 = {
    host: config.OU_LDAP_HOST,
    port: config.LDAP_PORT,
    ssl: true,
    clientOptions: {
        url: config.OU_LDAPS_URL,
        tlsOptions: {
            rejectUnauthorized: true
        }
    },
    credentials: {
        bindDN: config.AD_USER,
        bindPass: config.AD_USER_PASS
    }
}
const arr0 = Object.entries(obj0)

const type = 'AD3'
// console.log(config[`${type}_LDAP_HOST`])
// console.log(arr0[0][0])
let ssl = ''
if (obj0.ssl) ssl = 'S'
for(const [key, val] of Object.entries(obj0)) {
    const {...validOptions} = obj0
    // if(val.toString().includes(key)) {
    const obj = {
        ...validOptions[key],
        [key]: config[`${type}_LDAP_${key.toUpperCase()}`]
    }
    console.log(obj)
}