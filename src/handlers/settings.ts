import axios from "axios"
import {json, Request, Response } from "express"
import zlib from 'zlib'

const settingsGetter = async (req:Request,res:Response)=>{
    const headers = {
        "Authorization" : `Bearer ${req.body.authToken}`
    }
    const result = await axios.get("https://playerpreferences.riotgames.com/playerPref/v3/getPreference/Ares.PlayerSettings",{headers})
    const buff = Buffer.from(result.data.data,'base64')
    const rawsettings = zlib.inflateRawSync(buff)
    const parsedSettings = JSON.parse(rawsettings.toString())
    const parsedCrosshair = parsedSettings.stringSettings[2].value
    const encrypted = Buffer.from(JSON.stringify(parsedSettings)).toString("base64");
    res.send({"parsed":encrypted,"crossColor":parsedCrosshair})
}

const settingsSetter = async (req:Request,res:Response)=>{
    const headers = {
        "Authorization" : `Bearer ${req.body.authToken}`
    }
    const toBuffer = zlib.deflateRawSync(req.body.parsed).toString('base64')
    const result = await axios.put('https://playerpreferences.riotgames.com/playerPref/v3/savePreference',{"data":toBuffer,"type": "Ares.PlayerSettings"},{headers})
    res.send(result.data.data)
}
export {
    settingsGetter,
    settingsSetter
} 