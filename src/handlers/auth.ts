import {Request,Response } from "express";
import axios, { AxiosError } from 'axios'
import jwt from 'jsonwebtoken'

const { Agent } = require('https');
const ciphers = [
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256'
];
const agent = new Agent({ ciphers: ciphers.join(':'), honorCipherOrder: true, minVersion: 'TLSv1.2' });

export default async function authHandler(req: Request,res:Response){
    let authToken:string;
    let entToken;
    let cookiesRequest:any
    const inst = axios.create()
    let options = {
            uri:'https://auth.riotgames.com/api/v1/authorization',
            formData : {"acr_values": "","claims": "","client_id": "riot-client","code_challenge": "","code_challenge_method": "","nonce": "HDewORkVWVNXvZJLwvQlzA","redirect_uri": "http://localhost/redirect","response_type": "token id_token","scope": "link"}
    }
    try{

        cookiesRequest = await axios.post(options.uri,options.formData,{
            httpsAgent: agent
        })
        
    }
    catch(err:any){
        console.log(err)
    }
    let data 
    if(req.body.cookie && req.body.code){
        inst.defaults.headers.put['cookie'] = req.body.cookie
        data = {
            'type': 'multifactor',
            'rememberDevice': true,
            'code': req.body.code,
            
        }
    }else{
        
        inst.defaults.headers.put['cookie'] = cookiesRequest!.headers['set-cookie'] as unknown as string
        data = {
            'type': 'auth',
            'username': req.body.username,
            'password': req.body.password,
        }
    }
    let loginRequest
    try {
        loginRequest = await inst.put("https://auth.riotgames.com/api/v1/authorization",data,{httpsAgent: agent})}
    catch(err){
        res.send({"error":"Rate limited"})
        return
    }
    const pattern = new RegExp('access_token=(.*)&scope')
   
    if(loginRequest.data.error == "auth_failure"){
            res.send({"error":"Wrong credentials"})
    }else if(loginRequest.data.type="multifactor" && loginRequest.data.multifactor){
            res.send({"cookie":loginRequest.headers['set-cookie']})
    }else if(loginRequest.data.type="multifactor" && loginRequest.data.response){
        authToken = pattern.exec(loginRequest.data.response.parameters.uri)![1]
        try{
            entToken = await axios.post("https://entitlements.auth.riotgames.com/api/token/v1",{},{headers:{"Authorization":`Bearer ${authToken}`}})
        }catch(err){
            res.send("Error has happened")
        }
        
        res.send({"authToken":authToken,"entToken":entToken!.data.entitlements_token,"sub":jwt.decode(authToken)?.sub})
    }else if(loginRequest.data.error=="rate_limited"){
        res.send()
    }
    
    
}