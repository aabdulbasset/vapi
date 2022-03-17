import axios from "axios"
import { Request,Response } from "express"

type skin = {
    name:string,
    icon:string
}
export default function storeHandler(req:Request ,res:Response){
    
    const headers = {
        "Authorization":`Bearer ${req.body.authToken}`,
        "X-Riot-Entitlements-JWT": req.body.entToken
    }
    axios.get(`https://pd.eu.a.pvp.net/store/v2/storefront/${req.body.sub}`,{headers})
    .then(async (response) => {
        let dailySkinArray:skin[] = await Promise.all(response.data.SkinsPanelLayout.SingleItemOffers.map(async (item:string) => {
            
            const res  = await axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${item}`)
            return {"name":res.data.data.displayName,"icon":res.data.data.displayIcon}
        }))

        try{
            const night = response.data.BonusStore.BonusStoreOffers
            let nightSkinArray:skin[] = await Promise.all(response.data.BonusStore.BonusStoreOffers.map(async (item:string) => {
                
                const res  = await axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${item}`)
                return {"name":res.data.data.displayName,"icon":res.data.data.displayIcon}
            }))
            res.send({"daily":dailySkinArray,"night":nightSkinArray,"hasnight":true})
        }catch(err){
            res.send({"daily":dailySkinArray,"hasnight":false})
        }
       
    })
    .catch(()=>{
        res.sendStatus(400)
    })
}