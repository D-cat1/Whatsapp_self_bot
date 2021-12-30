const {
    Sequelize,
    DataTypes
} = require('sequelize')

const {Databse} = require('../config')



const multideviceDB = Databse.define('session', {
        name: {
            type: DataTypes.STRING
        },
        data: {
            type: DataTypes.JSON,
        }

    }, {
        freezeTableName: true,
        timestamps: false
    }

);
multideviceDB.removeAttribute('id')

const addsesi = async (value) => {
    await Databse.sync()
    const addses = await multideviceDB.create({
        name: 'sesi',
        data: value
    });
    return addses
}

const updatesesi = async (value) => {
    await Databse.sync()
    const update = await multideviceDB.update({
        data: value
    }, {
        where: {
            name: 'sesi'
        }
    })
    return update
}

const deletesesi = async () => {
    await Databse.sync()
    const del = await multideviceDB.destroy({
        where: {
            name: 'sesi'
        }
    })
    return del
}

const cekdb = async () => {
    await Databse.sync()
    const alsa = await multideviceDB.findAll({
        where: {
            name: 'sesi'
        }
    })
    return alsa
}



module.exports = {
    addsesi,
    updatesesi,
    deletesesi,
    cekdb,
    Databse
}