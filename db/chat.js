const {
    Sequelize,
    DataTypes
} = require('sequelize')
const {Databse} = require('./connection')



const multideviceDB = Databse.define('allchat', {
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

const addch = async (value) => {
    await Databse.sync()
    const addses = await multideviceDB.create({
        name: 'chats',
        data: value
    });
    return addses
}

const updatelsch = async (value) => {
    await Databse.sync()
    const update = await multideviceDB.update({
        data: value
    }, {
        where: {
            name: 'chats'
        }
    })
    return update
}


const cekch = async () => {
    await Databse.sync()
    const alsa = await multideviceDB.findAll({
        where: {
            name: 'chats'
        }
    })
    return alsa
}



module.exports = {
    addch,
    updatelsch,
    cekch
}