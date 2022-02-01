const ytdp = require('./add_on/ytdl_bin/ytdlp')

async function haha (){
    const test = await ytdp('https://youtu.be/C_l_hBsy9mU')
    console.log(test)
}

haha()