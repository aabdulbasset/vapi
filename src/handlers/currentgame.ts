import {Request,Response } from "express";
import axios from 'axios'
axios.defaults.headers.common['User-Agent'] = "RiotClient/50.0.0.4396195.4381201 rso-auth (Windows;10;;Professional, x64)"
let region = "eu"
const inGame = async (req:Request,res:Response)=>{
    
    let regionObj = {
        "eu":"eu",
        "na":"na",
        "kr":"kr",
        "ap":"ap",
    }
    if(req.body.region && req.body.region in regionObj){
        region = req.body.region
    }
    try{
        let sub = req.body.sub
        let ent = req.body.entToken
        let auth = req.body.authToken
        let url = `https://glz-${region}-1.${region}.a.pvp.net/core-game/v1/players/${sub}`
        
        let headers = {
            "Authorization":`Bearer ${auth}`,
            "X-Riot-Entitlements-JWT": ent
        }
        let result = await axios.get(url,{headers})

        res.send({"ingame":true,"matchid":await result.data.MatchID})
    }catch(err){
        res.send({"ingame":false,"matchid":null})
    }
}
const getAgents = async ()=>{
    let result = await (await axios.get("https://valorant-api.com/v1/agents")).data.data
    let agentsDict:any = {}
    result.forEach((agent:any)=>{
        agentsDict[agent.uuid] = {"name":agent.displayName,"icon":agent.displayIcon}
    })
    
    return agentsDict
}
const getNames = async (players:any)=>{
    let agentsUUID = await getAgents()
    
    let playersInfo = Promise.all(players.map(async (player:any)=>{
        let response = await axios.put(`https://pd.${region}.a.pvp.net/name-service/v2/players`,[player.Subject])
        let result = await response.data[0]
        return {"name":`${await result.GameName}#${await result.TagLine}`,"team":await player.TeamID,"sub":await player.Subject,"agent":agentsUUID[player.CharacterID.toLowerCase()],"level":player.PlayerIdentity.AccountLevel}
    }))
    return await playersInfo
    

}

const getRanks = async (players:string[],headers:any)=>{
    let seasonsRequest = await axios.get("https://valorant-api.com/v1/seasons")
    
    let seasonUUID = await seasonsRequest.data.data[seasonsRequest.data.data.length-1].uuid
    let rankDict:any = {
        "3":"IRON 1",
        "4":"IRON 2",
        "5":"IRON 3",
        "6":"BRONZE 1",
        "7":"BRONZE 2",
        "8":"BRONZE 3",
        "9":"SILVER 1",
        "10":"SILVER 2",
        "11":"SILVER 3",
        "12":"GOLD 1",
        "13":"GOLD 2",
        "14":"GOLD 3",
        "15":"PLATINUM 1",
        "16":"PLATINUM 2",
        "17":"PLATINUM 3",
        "18":"DIAMOND 1",
        "19":"DIAMOND 2",
        "20":"DIAMOND 3",
        "21":"IMMORTAL 1",
        "22":"IMMORTAL 2",
        "23":"IMMORTAL 3",
        "24":"Radiant",
    }
    let seasonsArray = await seasonsRequest.data.data
    let ranks = await Promise.all(players.map(async (player:any)=>{
        let url = `https://pd.${region}.a.pvp.net/mmr/v1/players/${player.sub}`
        let response = await axios.get(url,{headers})
        let result = await response.data
        let highestRank=0;
        let rank
        try{
            seasonsArray.forEach((season:any)=>{
                try{
                    if(result.QueueSkills.competitive.SeasonalInfoBySeasonID[season.uuid].CompetitiveTier>highestRank){
                        highestRank = result.QueueSkills.competitive.SeasonalInfoBySeasonID[season.uuid].CompetitiveTier
                        
                    }
                }catch(err){
                    return
                }
            })
            rank = result.QueueSkills.competitive.SeasonalInfoBySeasonID["67e373c7-48f7-b422-641b-079ace30b427"].CompetitiveTier
            
        }catch(err){
            console.log(err)
            rank = null
        }
        return {...player,"rank":rankDict[rank],"highestRank":rankDict[highestRank]}
    }))
    return ranks
}
const gameStatus = async (req:Request,res:Response)=>{
    let regionObj = {
        "eu":"eu",
        "na":"na",
        "kr":"kr",
        "ap":"ap",
    }
    if(req.body.region && req.body.region in regionObj){
        region = req.body.region
    }
    try{
        let matchid = req.body.matchid
        let ent = req.body.entToken
        let auth = req.body.authToken
        let url = `https://glz-${region}-1.${region}.a.pvp.net/core-game/v1/matches/${matchid}`
        let headers = {
            "Authorization":`Bearer ${auth}`,
            "X-Riot-Entitlements-JWT": ent,
            "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
            "X-Riot-ClientVersion":"release-05.00-shipping-6-725355"
        }
        let response = await axios.get(url,{headers})
        let result = await response.data
        let status;
        if(result.State == "IN_PROGRESS"){
            status = "inprogress"
            let players = await getNames(result.Players)
            let ranks = await getRanks(players,headers)
            res.send(ranks)

        }else{
            res.send({"status":result.State})
        }
    }catch(err){
        console.log(err)
    }
}
export {inGame,gameStatus}