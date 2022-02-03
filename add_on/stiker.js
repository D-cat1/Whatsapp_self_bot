const fs = require('fs')
const whatscmd = require('../command_list')
const {
    downloadContentFromMessage
} = require('@adiwajshing/baileys')
const mime = require('mime')
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream')

const mem = require('meme-maker')





whatscmd.addCmd({
    name: 'stik',
    hint: '.stik',
    desc: 'membuat stiker'
}, async (client, msg, args) => {
    if (!msg.isReply) return msg.reply('reply bang ?')
    const isImg = msg.message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
    const isVid = msg.message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
    if (isImg != null) {
        const streamImg = await downloadContentFromMessage(isImg, 'image')
        let buffer = Buffer.from([])
        for await (const chunk of streamImg) {
            buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(`${msg.message.key.id}.${mime.getExtension(isImg.mimetype)}`, buffer)
        ffmpeg(`${msg.message.key.id}.${mime.getExtension(isImg.mimetype)}`)
        .outputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
        .save(`${msg.message.key.id}.webp`)
        .on('end', async () => {
            await client.sendMessage(msg.to, {
                sticker: {url: `${msg.message.key.id}.webp`}
            })
            fs.unlinkSync( `${msg.message.key.id}.webp`)
            fs.unlinkSync( `${msg.message.key.id}.${mime.getExtension(isImg.mimetype)}`)
        })
    } else if (isVid != null) {
        const streamVid = await downloadContentFromMessage(isVid, 'video')
        let buffer = Buffer.from([])
        for await (const chunk of streamVid) {
            buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(`${msg.message.key.id}.${mime.getExtension(isVid.mimetype)}`, buffer)
        ffmpeg(`${msg.message.key.id}.${mime.getExtension(isVid.mimetype)}`)
        .outputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
        .save(`${msg.message.key.id}.webp`)
        .on('end', async () => {
            await client.sendMessage(msg.to, {
                sticker: {url: `${msg.message.key.id}.webp`}
            })
            fs.unlinkSync( `${msg.message.key.id}.webp`)
            fs.unlinkSync( `${msg.message.key.id}.${mime.getExtension(isVid.mimetype)}`)
        })
    } else {
        msg.reply('tipe file tidak didukung!')
    }
})

whatscmd.addCmd({
    name: 'mestik',
    hint: '.mestik',
    desc: 'membuat stiker meme'
}, async (client, msg, args) => {
    if (!msg.isReply && msg.isNoArgs) return msg.reply('reply bang ?')
    const textmem = args.split(';')
    const isImg = msg.message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage
    const isVid = msg.message?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
    if (isImg != null) {
        const streamImg = await downloadContentFromMessage(isImg, 'image')
        let buffer = Buffer.from([])
        for await (const chunk of streamImg) {
            buffer = Buffer.concat([buffer, chunk])
        }
        fs.writeFileSync(`${msg.message.key.id}.${mime.getExtension(isImg.mimetype)}`, buffer)
            ffmpeg(`${msg.message.key.id}.${mime.getExtension(isImg.mimetype)}`)
            .outputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
            .save(`${msg.message.key.id}.webp`)
            .on('end', async () => {
                let options = {
                    image: `${msg.message.key.id}.webp`,         // Required
                    outfile: `${msg.message.key.id}-1.webp`,  // Required
                    topText: textmem[0],            // Required
                    bottomText: textmem[1] == undefined ? '': textmem[1],           // Optional // Optional
                    fontSize: 37,                   // Optional
                    fontFill: '#FFF',               // Optional
                    textPos: 'center',              // Optional
                    strokeColor: '#000',            // Optional
                    strokeWeight: 1.5                 // Optional
                  }
                  
                  mem(options, async function() {
                await client.sendMessage(msg.to, {
                    sticker: {url: `${msg.message.key.id}-1.webp`}
                })
                fs.unlinkSync( `${msg.message.key.id}.webp`)
                fs.unlinkSync( `${msg.message.key.id}.${mime.getExtension(isImg.mimetype)}`)
                fs.unlinkSync( `${msg.message.key.id}-1.webp`)
            })
        })
          
    } else {
        msg.reply('tipe file tidak didukung!')
    }
})