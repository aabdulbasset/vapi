import { Request,Response,NextFunction } from "express";

export default function checkUserPass(req:Request,res:Response,next:NextFunction){
    if((!req.body.username || !req.body.password)&& !req.body.code){
        res.send("Missing username or password")
    }else{
        next()
    }
}