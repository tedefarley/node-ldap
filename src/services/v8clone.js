const v8 = require('v8')

const clone = (obj) => {
    return v8.deserialize(v8.serialize(obj))
}

module.exports = clone()