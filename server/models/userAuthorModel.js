const mongoose=require('mongoose')

const userAuthorSchema=new mongoose.Schema({
    role:{
        type:String,
        require:true,
    },
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        // require:true,
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    profileImageUrl:{
        type:String,
    },
    isActive:{
        type:Boolean,
        default:true,
    }
},{"strict":"throw"})


const userAuthor=mongoose.model('userAuthor',userAuthorSchema)


module.exports=userAuthor;