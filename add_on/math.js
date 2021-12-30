const whatscmd = require('../command_list')
const math = require('mathjs')

whatscmd.addCmd({
    name: 'math',
    hint: '.math 1 x 2',
    desc: 'menghitung operasi matematika sederhana'
}, async (client, msg, args) => {
    try {
        var operamath = args.replace(/x/g, '*').replace(/ke/g, 'to').replace(/:/g, '/')
        var calculate = math.evaluate(operamath).toString()
        await client.sendMessage(msg.to, {
            text: `${args} = ${calculate}`
        })
    } catch (e) {
        await client.sendMessage(msg.to, {
            text: `*${e}*`
        }) 
    }
})