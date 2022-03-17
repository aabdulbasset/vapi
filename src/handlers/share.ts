import { Request,Response } from "express";
import { pool } from "../utils/db";

const createCollection = async (req:Request,res:Response)=>{
    const client = await pool.connect()
    const result = await client.query("select link,skins from collections where sub=($1)",[req.body.sub])

    if(result.rows.length > 0){
        client.query("update collections set skins = ($1) where sub = ($2)",[{"skins":req.body.skins},req.body.sub])
        res.send({"link":result.rows[0].link})
    }else{
        const link = await checkIfExists(makeid(6))
        const query = "insert into collections(link,sub,skins) values($1,$2,$3)"
        client.query(query,[link,req.body.sub,{"skins":req.body.skins}])
        res.send({"link":link})
    }
    client.release()
}
const viewCollection =async (req:Request,res:Response)=>{
    const client = await pool.connect()
    try{
        const result = await client.query("select skins from collections where link = ($1)",[req.params.id])
        if(result.rows.length > 0){
            res.send(result.rows[0].skins.skins)
        }else{
            res.send({"err":"None"})
        }
    }catch(err){
        res.send(err)
    }
    client.release()
}

async function checkIfExists(random:string){
    const client = await pool.connect()
    const result = await client.query("select * from collections where link = ($1) ",[random])
    client.release()
    if(result.rows.length > 0){
        checkIfExists(makeid(6))
    }else{
    
        return random
    }
}

function makeid(length:number) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export {
    createCollection,
    viewCollection
}