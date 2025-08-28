import { Client } from 'pg'

const client = new Client({
    connectionString: process.env.DB_CONNECTION_STRING || "postgresql://neondb_owner:npg_cQH3Vg2hmJLj@ep-green-butterfly-adt69mk3-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false
    }
}) 

const connectionToDB = async () => {
    try {
        await client.connect();
        console.log("Db connected successfully");
        return true;
    } catch (error) {
        console.log("Error connecting to db:", error);
        return false;
    }
}
 
export { connectionToDB, client };