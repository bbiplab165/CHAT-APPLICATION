const jwt=require("jsonwebtoken")

exports.authenticate=async(req,res,next)=>{
    try{
        const token=req.header("Authorization")
        const data=jwt.verify(token,"hello")
        req.userId=data.userId
        next()
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message:err })
    }
}

// exports.group=async(req,res)=>{
//     try{
//         const groupId=req.params.id
//         console.log(groupId);
//         next()
//     }
//     catch(err){
//         return res.status(500).json({ message:err })
//     }
// }