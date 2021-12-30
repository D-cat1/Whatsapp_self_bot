const {
    DataTypes
} = require('sequelize')
const {Databse} = require('./connection')
const multideviceDB = Databse.define('catatan', {
        nomor: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        isi: {
            type: DataTypes.STRING,
        }

    }, {
        timestamps: false,
        freezeTableName: true
    }

);
multideviceDB.removeAttribute('id')

const updatenote = async (value, nama, nomor) => {
    await Databse.sync()
    const update = await multideviceDB.update({
        isi: value
    }, {
        where: {
            name: nama,
            nomor: nomor,
        }
    })
    return update
}

const deletenote = async (nama, nomor) => {
    await Databse.sync()
    const del = await multideviceDB.destroy({
        where: {
            name: nama,
            nomor: nomor
        }
    })
    return del
}

const getallnote = async (nomer) => {
    await Databse.sync()
    const alsa = await multideviceDB.findAll({
        where: {
            nomor: nomer
        }
    })
    return alsa
}

const ceknote = async (nama, nomer) => {
    await Databse.sync()
    const alsa = await multideviceDB.findAll({
        where: {
            name: nama,
            nomor: nomer
        }
    })
    return alsa
}

const addnote = async (nama, isian, nomor) => {
    await Databse.sync()
    if ((await ceknote(nama, nomor)).length == 0){
    const addses = await multideviceDB.create({
        name: nama,
        isi: isian,
        nomor: nomor
    });
    return addses
    } else {
        return true
    }
}


module.exports = {
    addnote,
    updatenote,
    deletenote,
    ceknote,
    getallnote
}