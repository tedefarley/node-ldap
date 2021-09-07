const config = require('./config/config')
const ADServices = require('./services/ADServices')

const test = async () => {
    try {
        console.log(config.AD_USER)
        // console.log(ADServices.getGUID('tefarley'))
    } catch (err)  {
        console.log(err)
    } finally {
        client.unbind()
    }
}
test()