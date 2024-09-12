const dev = {
    host: 'localhost',
    port: 3306,
    user: 'mam',
    password: process.env.DB_PASS,
    database: 'dbpythn'
}

const prod = {
    host: '10.180.50.214',
    port: 3306,
    user: 'mame',
    password: process.env.PROD_DB_PASS,
    database: 'db_crypto'
}

module.exports={dev,prod}