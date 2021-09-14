const ADServices = require('./src/services/ADServices')

const main = async () => {
    try {
        await ADServices.removeMembersFromGroup(['tefarley'], 'LS-US-IT-TESTER-3')
    } catch (err)  {
        console.log(err)
    }
}

main()