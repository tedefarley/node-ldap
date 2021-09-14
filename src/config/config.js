require('dotenv').config()
const AD3_LDAP_HOST = process.env.AD3_LDAP_HOST
const OU_LDAP_HOST = process.env.OU_LDAP_HOST
const LDAP_PORT = process.env.LDAP_PORT

const AD_USER = process.env.AD_USER
const AD_USER_PASS = process.env.AD_USER_PASS

const AD3_LDAP_URL = process.env.AD3_LDAP_URL
const OU_LDAP_URL = process.env.OU_LDAP_URL
const AD3_LDAPS_URL = process.env.AD3_LDAPS_URL
const OU_LDAPS_URL = process.env.OU_LDAPS_URL

const AD3_USERS_BASE = process.env.AD3_USERS_BASE
const OU_GROUPS_BASE = process.env.OU_GROUPS_BASE
const OU_TEST_BASE = process.env.OU_TEST_BASE

module.exports = {
    AD3_LDAP_HOST,
    OU_LDAP_HOST,
    LDAP_PORT,
    AD_USER,
    AD_USER_PASS,
    AD3_LDAPS_URL,
    OU_LDAPS_URL,
    AD3_USERS_BASE,
    OU_GROUPS_BASE,
    OU_TEST_BASE
}