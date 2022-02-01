const {
    create: createYoutubeDl
} = require('youtube-dl-exec')
const ytdlp = createYoutubeDl('././yt-dlp')


const youtube_json = async (url) => {
    try {
        const dataJson = await ytdlp(url, {
            dumpSingleJson: true
        })
        dataJson['error'] = false
        return dataJson
    } catch (edr) {
        console.log(edr)
        return {error : true, Reason: edr.shortMessage}
    }
}


module.exports = youtube_json