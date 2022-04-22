import {Client,Pool} from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const client = new Client({
    
    connectionString:process.env.DATABASE_URL ,
    ssl : {
        rejectUnauthorized: false
    }
})
const pool = new Pool({
    
    connectionString:process.env.DATABASE_URL ,
    ssl : {
        rejectUnauthorized: false
    }
})
export{
    client,
    pool
}