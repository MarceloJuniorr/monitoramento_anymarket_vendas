import { createPool } from 'mysql2/promise'
import { config } from './config.js'


const {database} = config


export const connectionSqlmonitoramento = createPool({
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.password,
    database: database.name
})


export default connectionSqlmonitoramento
