const whats = require('../command_list')
const {
    proto,
    prepareWAMessageMedia,
    generateWAMessageFromContent
} = require('@adiwajshing/baileys')
const dataformat = []
const {
    default: got
} = require('got')
const human = require('byte-size')
const { format } = require('sharp')
const mimt = require('mime')


whats.addCmd({
    name: 'ytdl',
    desc: 'downloader stream host',
    hint: '.ytdl (link)',
}, async (client, msg, args) => {
    if (msg.noArgs) return msg.reply('mana linknya?')
    const ytdl_api = await got.get('https://api.dcat.my.id/streamdl?link=' + args).json()
    if (ytdl_api.error) {
        msg.reply(ytdl_api.Reason)
    } else {
        dataformat.push({
            name: ytdl_api.title,
            key: msg.message.key.id,
            format: ytdl_api.formats,
            host: ytdl_api.extractor
        })
        const wamsg = await prepareWAMessageMedia({
            image: {
                url: ytdl_api.thumbnail
            }
        }, {
            upload: client.waUploadToServer
        })
        const template = generateWAMessageFromContent(msg.to, proto.Message.fromObject({
            templateMessage: {
                hydratedTemplate: {
                    hydratedContentText: `*${ytdl_api.title}*`,
                    hydratedFooterText: 'diambil dari ' + ytdl_api.extractor,
                    imageMessage: wamsg.imageMessage,
                    hydratedButtons: [{
                            quickReplyButton: {
                                displayText: 'Unduh MP3 (YT ONLY)',
                                id: 'ytdlaud ' + msg.message.key.id
                            }
                        },
                        {
                            quickReplyButton: {
                                displayText: 'Unduh Video',
                                id: 'ytdlvid ' + msg.message.key.id
                            }
                        }
                    ]
                }
            }
        }), {
            userJid: msg.message.participant || msg.message.key.remoteJid,
            quoted: msg.message
        });
        await client.relayMessage(
            msg.to,
            template.message, {
                messageId: template.key.id
            }
        )
    }
})


whats.addCmd({
    name: 'ytdlvid',
    disable_cmd: true
}, async (whatsapp, msg, args) => {
    const data_pemng = dataformat.filter(dataid => dataid.key === args)
    if (data_pemng.length == 0) {
        msg.reply('```Terjadi Error!, Coba Lagi```\n[' + args + ']')
    } else {
        const data_yt = []
        data_pemng[0].format.forEach(formatt => {
            const sizefile = formatt.filesize == null ? formatt.filesize_approx : formatt.filesize
            if (sizefile < 90000000){
            if (formatt.acodec == "none" && formatt.vcodec != "none"){
            data_yt.push({title: formatt.format, rowId: `getmvid ${args} ${formatt.format_id}`, description: `🔇 🎞️ 🪀 [${human(sizefile)}] (${formatt.ext})`})
            } else if (formatt.acodec != "none" && formatt.vcodec == "none"){
            data_yt.push({title: formatt.format, rowId: `getmvid ${args} ${formatt.format_id}`, description: `🔊 🪀 [${human(sizefile)}] (${formatt.ext}) {${formatt.acodec}}`})
            } else if (formatt.acodec != "none" && formatt.vcodec != "none"){
            data_yt.push({title: formatt.format, rowId: `getmvid ${args} ${formatt.format_id}`, description: `🔊 🎞️ 🪀 [${human(sizefile)}] (${formatt.ext}) {${formatt.acodec}}`})
            }
        } else {
            if (formatt.acodec == "none" && formatt.vcodec != "none"){
                data_yt.push({title: formatt.format, rowId: `getmvid ${args} ${formatt.format_id}`, description: `🔇 🎞️ ☁️ [${human(sizefile)}] (${formatt.ext})`})
                } else if (formatt.acodec != "none" && formatt.vcodec == "none"){
                data_yt.push({title: formatt.format, rowId: `getmvid ${args} ${formatt.format_id}`, description: `🔊 ☁️ [${human(sizefile)}] (${formatt.ext}) {${formatt.acodec}}`})
                } else if (formatt.acodec != "none" && formatt.vcodec != "none"){
                data_yt.push({title: formatt.format, rowId: `getmvid ${args} ${formatt.format_id}`, description: `🔊 🎞️ ☁️ [${human(sizefile)}] (${formatt.ext}) {${formatt.acodec}}`})
                }
        }
        });

        const sections = [{
            title: "Pilih resolusi yang diinginkan",
            rows:  data_yt
        }]
        await whatsapp.relayMessage(msg.to, {
            listMessage: {
                buttonText: 'Pilih Resolusi',
                description: `Pilih disini:`,
                sections: sections,
                listType: 1
            }
            
    }, msg.message.key.id)

    }
})

whats.addCmd({
    name: 'getmvid',
    disable_cmd: true
}, async (whatsapp, msg, args) => {
    const data_pemng = dataformat.filter(dataid => dataid.key === args.split(' ')[0])
    if (data_pemng.length == 0) {
        msg.reply('```Terjadi Error!, Coba Lagi```\n[' + args + ']')
    } else {
        const linkvid = data_pemng[0].format.filter(format => format.format_id === args.split(' ')[1])
        const sizefile = linkvid[0].filesize == null ? linkvid[0].filesize_approx : linkvid[0].filesize
        if (sizefile < 20000000){
            if (linkvid[0].ext == 'mp4' || linkvid[0].ext == '3gp'){
                whatsapp.sendMessage(msg.to, {video: {url: linkvid[0].url}, caption: data_pemng[0].name})
            } else if (linkvid[0].ext == 'webm'){
                whatsapp.sendMessage(msg.to, {audio: {url: linkvid[0].url}})
            } else if (linkvid[0].ext.toLowerCase() == 'jpg' || linkvid[0].ext.toLowerCase() == 'png' || linkvid[0].ext.toLowerCase() == 'webp'){
                whatsapp.sendMessage(msg.to, {image: {url: linkvid[0].url}, mimetype: mimt.getType(linkvid[0].ext), caption: data_pemng[0].name})
            } else {
                whatsapp.sendMessage(msg.to, {document: {url: linkvid[0].url}, mimetype: mimt.getType(linkvid[0].ext),  fileName: data_pemng[0].name+'.'+linkvid[0].ext})
            }
        } else if (sizefile < 90000000){
            if (data_pemng[0].host == 'Instagram' || data_pemng[0].host == 'TikTok'){
                if (linkvid[0].ext == 'mp4' || linkvid[0].ext == '3gp'){
                    whatsapp.sendMessage(msg.to, {video: {url: linkvid[0].url}, caption: data_pemng[0].name})
                } else if (linkvid[0].ext == 'webm'){
                    whatsapp.sendMessage(msg.to, {audio: {url: linkvid[0].url} })
                } else if (linkvid[0].ext.toLowerCase() == 'jpg' || linkvid[0].ext.toLowerCase() == 'png' || linkvid[0].ext.toLowerCase() == 'webp'){
                    whatsapp.sendMessage(msg.to, {image: {url: linkvid[0].url}, caption: data_pemng[0].name})
                } else {
                    whatsapp.sendMessage(msg.to, {document: {url: linkvid[0].url},mimetype: mimt.getType(linkvid[0].ext), fileName: data_pemng[0].name+'.'+linkvid[0].ext})
                }
            } else {
            whatsapp.sendMessage(msg.to, {document: {url: linkvid[0].url}, mimetype: mimt.getType(linkvid[0].ext) , fileName: data_pemng[0].name+'.'+linkvid[0].ext})
            }
        } else {
            if (data_pemng[0].host == 'Instagram' || data_pemng[0].host == 'TikTok'){
                if (linkvid[0].ext == 'mp4' || linkvid[0].ext == '3gp'){
                    whatsapp.sendMessage(msg.to, {video: {url: linkvid[0].url}, caption: data_pemng[0].name})
                } else if (linkvid[0].ext == 'webm'){
                    whatsapp.sendMessage(msg.to, {audio: {url: linkvid[0].url} })
                } else if (linkvid[0].ext.toLowerCase() == 'jpg' || linkvid[0].ext.toLowerCase() == 'png' || linkvid[0].ext.toLowerCase() == 'webp'){
                    whatsapp.sendMessage(msg.to, {image: {url: linkvid[0].url}, caption: data_pemng[0].name})
                } else {
                    whatsapp.sendMessage(msg.to, {document: {url: linkvid[0].url},mimetype: mimt.getType(linkvid[0].ext), fileName: data_pemng[0].name+'.'+linkvid[0].ext})
                }
            } else {
            const templateButtons = [
                {index: 1, urlButton: {displayText: 'Unduh Disini', url: linkvid[0].url}},
            ]
            
            const templateMessage = {
                text: '*'+data_pemng[0].name+'*',
                footer: 'Diambil dari '+data_pemng[0].host,
                templateButtons: templateButtons
            }
            
            await whatsapp.sendMessage(msg.to, templateMessage)
        }
        }
    }
})

whats.addCmd({
    name: 'ytdlaud',
    disable_cmd: true
}, async (whatsapp, msg, args) => {
    const data_pemng = dataformat.filter(dataid => dataid.key === args)
    if (data_pemng.length == 0) {
        msg.reply('```Terjadi Error!, Coba Lagi```\n[' + args + ']')
    } else {
        if (data_pemng[0].host != 'youtube') {
            msg.reply('host yang support untuk mp3 hanya youtube!')
        } else {
            msg.reply('soon')
        }
    }
})