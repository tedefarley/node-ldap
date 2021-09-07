require('dotenv').config({ path: '~/Documents/Labs/JSLab\/node-ldap/src/config/.env' })
const AD3_LDAP_HOST = process.env.AD3_LDAP_HOST
const OU_LDAP_HOST = process.env.OU_LDAP_HOST
const LDAP_PORT = process.env.LDAP_PORT

const AD_USER = process.env.AD_USER
const AD_USER_PASS = process.env.AD_USER_PASS

const AD3_LDAP_URL = process.env.AD3_LDAP_URL
const OU_LDAP_URL = process.env.OU_LDAP_URL
const AD3_LDAPS_URL = process.env.AD3_LDAPS_URL
const OU_LDAPS_URL = process.env.OU_LDAPS_URL

const AD_USERS_BASE = process.env.AD_USERS_BASE
const OU_GROUPS_BASE = process.env.OU_GROUPS_BASE
const AD_LS_BASE = process.env.OU_LS_BASE
const AD_TEST_GROUP = process.env.AD_TEST_GROUP

module.exports = {
    AD3_LDAP_HOST,
    OU_LDAP_HOST,
    LDAP_PORT,
    AD_USER,
    AD_USER_PASS,
    AD3_LDAPS_URL,
    OU_LDAPS_URL,
    AD_USERS_BASE,
    OU_GROUPS_BASE
}