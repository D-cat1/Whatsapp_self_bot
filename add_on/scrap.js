const wiki = require('wikijs').default;
const whatscmd = require('../command_list')

whatscmd.addCmd({
    name: 'wiki',
    hint: '.wiki panda',
    desc: 'mencari artikel pada wikipedia'
}, async (client, msg, args) => {
    if (msg.noArgs) return msg.reply('apa yang mau dicari di wiki ?')
    try {
        var artikel = await wiki({
                apiUrl: 'https://id.wikipedia.org/w/api.php'
            })
            .page(args);

        var found = await artikel.rawContent();
        msg.reply(found)
    } catch (e) {
        msg.reply('artikel tidak ditemukan!')
    }
})

whatscmd.addCmd({
    name: 'tts',
    hint: '.tts panda adalah binatang',
    desc: 'text to speech based on google translate'
}, async (client, msg, args) => {
    if (msg.noArgs) return msg.reply('apa yang mau dicari di wiki ?')
    try {
        client.sendMessage(msg.to, {audio: {url: `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(args)}&tl=id&client=tw-ob`,},ptt: true, mimetype: 'audio/mp3'})
    } catch (e) {
        msg.reply('error terjadi')
    }
})