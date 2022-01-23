const whatscmd = require('../command_list')
const {
    default: got
} = require('got')
const sharp = require('sharp');

function generate(ingfo) {
    return new Promise(async (resolve) => {
        const aaa = await got.post('https://api-quote.dcat.my.id/generate', {
            json: {
                "type": "quote",
                "format": "webp",
                "backgroundColor": "light",
                "backgroundColor": "#FFFFFF",
                "width": 360,
                "height": 360,
                "scale": 2,
                "messages": [{
                    "entities": [],
                    "avatar": true,
                    "from": {
                        "id": 1,
                        "name": ingfo.name,
                        "photo": {
                            "url": ingfo.pp
                        },
                    },
                    "text": ingfo.text,
                    "replyMessage": {}
                }]
            }
        }).json()
        const bsbuff = Buffer.from(aaa.result.image, 'base64')
        let sharpImg = sharp(bsbuff);
        sharpImg = sharpImg.webp();

        sharpImg = sharpImg.resize(512, 512, {
            fit: 'contain',
            background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0
            },
        });
        const buff = await sharpImg.toBuffer()
        resolve(buff)
    })
}

whatscmd.addCmd({
    name: 'quote',
    desc: 'membuat chat menjadi stiker',
    hint: '.quote (reply yang dirubah jadi stiker _hanya bisa untuk text_)',
}, async (client, msg, args) => {
    if (msg.isReply) {
        var info = {}
        const jid_quoted = msg.message.message.extendedTextMessage.contextInfo.remoteJid == '' ? msg.message.message.extendedTextMessage.contextInfo.participant : msg.message.message.extendedTextMessage.contextInfo.remoteJid
        const key =  msg.message.message.extendedTextMessage.contextInfo.stanzaId
        const text = msg.message.message.extendedTextMessage.contextInfo.quotedMessage.conversation == '' ? msg.message.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage == null ? 'jangan reply selain text!' : msg.message.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.text : msg.message.message.extendedTextMessage.contextInfo.quotedMessage.conversation || 'jangan reply selain text!'
        const data_quote = await msg.loadmsg(msg.to, key)
        try {
            const newa = await client.profilePictureUrl(jid_quoted, 'preview')
            info['pp'] = newa
        } catch (a) {
            info['pp'] = 'https://i.ibb.co/PN1NkpY/avatrs.png'
        }
        if (data_quote.pushName == null) {
            if (msg.noArgs) {
                client.sendMessage(msg.to, {
                    text: 'Nama Tidak Terdeteksi Membutuhkan input manual'
                })
            } else {
                info['name'] = args
                info['text'] = text
                const databuff = await generate(info)
                await client.sendMessage(msg.to, {
                    sticker: databuff
                })
            }
        } else {
            info['name'] = data_quote.pushName
            info['text'] = text
            const databuff = await generate(info)
            await client.sendMessage(msg.to, {
                sticker: databuff
            })
        }

    } else {
        client.sendMessage(msg.to, {
            text: 'Reply Pesan Yang Akan Diquote\n*Baca help!*'
        })
    }
})