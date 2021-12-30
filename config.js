require('dotenv').config()
const {
    Sequelize
} = require('sequelize')

module.exports = {
    Databse : process.env.DATABASE_URL === undefined ? new Sequelize({
        dialect: 'sqlite',
        storage: './selfbt.db',
        logging: false
    }) : new Sequelize(process.env.DATABASE_URL, {dialectOptions: {ssl: {require: true, rejectUnauthorized: false}}, logging: false}),
    PREFIX: process.env.PREFIX === undefined ? '.' : process.env.PREFIX,
    OTUSER: process.env.OTUSER == undefined ? [] : JSON.parse(process.env.OTUSER),
    HEROKU: process.env.HEROKU == undefined ? false : true,
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME == undefined ? '.' : process.env.HEROKU_APP_NAME,
    HEROKU_APP_KEY: process.env.HEROKU_APP_KEY == undefined ? '.' : process.env.HEROKU_APP_KEY, 
    BRANCH: process.env.BRANCH == undefined ? 'master':process.env.BRANCH
}
