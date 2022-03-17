import { Request,Response,NextFunction } from "express";

function checkAuth(req:Request,res:Response,next:NextFunction){
    if(!req.body.authToken){
        res.send("Missing auth token")
        return
    }else{
        next()
    }
}
function checkENT(req:Request,res:Response,next:NextFunction){
    if(!req.body.entToken){
        res.send("Missing ENT token")
        return
    }else{
        next()
    }
}
function checkSub(req:Request,res:Response,next:NextFunction){
    if(!req.body.sub){
        res.send("Missing SUB token")
        return
    }else{
        next()
    }
}
function checkColor(req:Request,res:Response,next:NextFunction){
    if(!req.body.crossColor){
        res.send("Missing Color")
        return
    }else{
        next()
    }
}
function checkSKins(req:Request,res:Response,next:NextFunction){
    if(!req.body.skins){
        res.send("Missing Skins")
        return
    }else{
        next()
    }
}
export {
    checkAuth,
    checkSub,
    checkENT,
    checkColor,
    checkSKins
}