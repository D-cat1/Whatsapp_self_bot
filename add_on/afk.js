const whats = require('../command_list')
let afk

whats.addCmd({
    name: 'afk',
    hint: '.afk atau .afk <alasan>',
    desc: 'menandakan saat afk'
}, async (whatsapp, msg, args) => {
    afk = true
    msg.reply('user afk')
})

whats.addCmd({
    on: 'message'
}, async (whatsapp, msg, args) => {

    if (afk) {
        if (msg.isgroup) {
            if (msg.message.message.extendedTextMessage?.contextInfo?.mentionedJid != undefined) {
                const deg_id = whatsapp.user.id.split(':')[1].split('@')[0]
                const numb_user = whatsapp.user.id.replace(':' + deg_id, '')
                if (msg.message.message.extendedTextMessage.contextInfo.mentionedJid.includes(numb_user)) {
                    msg.reply('user sedang nonaktif')
                }
            } else if (msg.message.message.extendedTextMessage?.contextInfo?.quotedMessage != null) {
                const deg_id = whatsapp.user.id.split(':')[1].split('@')[0]
                const numb_user = whatsapp.user.id.replace(':' + deg_id, '')
                if (msg.message.message.extendedTextMessage.contextInfo.mentionedJid.includes(numb_user)) {
                    msg.reply('user sedang nonaktif')
                }
            }
        } else if (!msg.isgroup) {
            if (!msg.message.key.fromMe){
                msg.reply('user afk')
            } else {
                msg.reply('user tidak afk')
                afk = false
            }
        }

    }
})