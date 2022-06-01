//imports
import axios from "axios";
import { Request,Response } from "express";
import {pool} from '../utils/db'
//actual functions
export default async function skinsHandler(req:Request,res:Response){
    let skins 
    let region = "eu"
    let regionObj = {
        "eu":"eu",
        "na":"na",
        "kr":"kr",
        "ap":"ap",
    }
    if(req.body.region && req.body.region in regionObj){
        region = req.body.region
    }
    const headers= {
        "Authorization":`Bearer ${req.body.authToken}`,
        'X-Riot-Entitlements-JWT':req.body.entToken
    }
   try{
       skins = await axios.get(`https://pd.${region}.a.pvp.net/store/v1/entitlements/${req.body.sub}/e7c63390-eda7-46e0-bb7a-a6abdacd2433`,{headers})
   }catch(err){
       res.sendStatus(400)
       return
   }
   let skinsList = []
   const client =await pool.connect()
   if(skins){
        for(let i =0; i< skins.data.Entitlements.length;i++){
            let query
            if(req.body.free == 1){
                 query = "select skins.name,levels.iconlink,skins.tier from skins inner join levels on skins.name = levels.name where levels.uuid = ($1)"
            }else{
                 query = "select skins.name,levels.iconlink,skins.tier from skins inner join levels on skins.name = levels.name where levels.uuid = ($1) and not tier =0 and not tier=1"
            }
            const result = await client.query(query,[skins.data.Entitlements[i].ItemID])
            if(result.rows.length > 0){
                if(result.rows[0].name ||result.rows[0].iconlink )
                skinsList.push({"name":result.rows[0].name,"icon":result.rows[0].iconlink})
            }
        }
    }
   client.release()
   res.send(skinsList)
   return
}