const ADServices = require('./services/ADServices')

const main = async () => {
    try {
        await ADServices.removeMembersFromGroup(['tefarley', 'jwtrask'], 'LS-US-IT-TESTER-3')
    } catch (err)  {
        console.log(err)
    }
}

main()