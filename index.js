require('dotenv').config({ path: './src/config/.env' })

const ldap = require('ldapjs')
const client = ldap.createClient({ url: process.env.LDAP_URL })

client.bind(
    process.env.AD_USER, 
    process.env.AD_PASSWORD, 
    (err) => { 
        if(err) throw err
        else {
            client.unbind()
        }
    }
)

const search = client.search(
    "OU=LS,OU=DEPARTMENTS,DC=OU,DC=AD3,DC=UCDAVIS,DC=EDU",
    { scope: 'base' },
    (err) => { 
        if(err) throw err 
    }
)

console.log(search)