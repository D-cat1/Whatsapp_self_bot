const {
    default: makeWASocket,
    BufferJSON,
    initInMemoryKeyStore,
} = require('@adiwajshing/baileys-md')
const loeg = require('pino')
const fs = require('fs')
const {
    cekdb,
    updatesesi
} = require('./db/connection')
const Mime = require('mime/Mime')
const loadState = async () => {
    let state
    try {
        const data = await cekdb()
        const value = JSON.parse(data[0].dataValues.data, BufferJSON.reviver)
        state = {
            creds: value.creds,
            // stores pre-keys, session & other keys in a JSON object
            // we deserialize it here
            keys: initInMemoryKeyStore(value.keys, async () => await saveState(jsonsesi.state))
        }
    } catch (e) {
        console.log(e)
    }
    return state
}

const saveState = async (state) => {
    console.log('menyimpan sesi')
    await updatesesi(JSON.stringify(state, BufferJSON.replacer, 2))
}

const load_temp_state = async () => {
    console.log('mengambil sesi...')
    try {
        const data = await cekdb()
        fs.writeFileSync(
			'temp.json',
			// BufferJSON replacer utility saves buffers nicely
			data[0].dataValues.data
		)
    } catch (e) {
        console.log(e)
    }
}

const startSock = (statik) => {
    const sock = makeWASocket({
        logger: loeg.pino({
            level: 'silent'
        }),
        auth: statik, 
        getMessage: async (key) => {
            console.log(key)
        }
    })
    return sock
}

const lengthdb = async () => {
    const leng = await cekdb()
    if (leng.length == 1) {
        return true
    } else if (leng.length <= 0) {
        return false
    }
}

const getMBsize = (Nama_file) => {
    var stats = fs.statSync(Nama_file)
    var fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes
}


const cektipe = (file) => {
    const typeMap = {
        'video': ['mp4', 'mkv', 'webm'],
        'audio': ['mp3'],
        'dokumen': ['pdf']
    };

    const typecek = new Mime(typeMap)
    const tipe = typecek.getType(file)
    return tipe
}

fs.watchFile('temp.json', async () => {
    if (fs.existsSync('temp.json')){
    const json_pare = JSON.parse(fs.readFileSync('temp.json'), BufferJSON.reviver)
    await saveState(json_pare)
    }
})

module.exports = {
    startSock,
    saveState,
    loadState,
    lengthdb,
    getMBsize,
    cektipe,
    load_temp_state
}