const mongoose = require('mongoose');
const ProfileSchema = new mongoose.Schema({
  user :{
    type:mongoose.Schema.Types.ObjectId,
    ref : 'users'
  },
  company :{
    type : String
  },
  website:{
    type : String
  },
  location:{
    type:String
  },
  status:{
    type:String
  },
  dateOfBirth:{
    type : Date
  },
  skills:{
    type:[String],
    required:true
  },
  bio:{
    type:String
  },
  education:[
    {
      school:{
        type:String,
        required : true
      },
      degree :{
        type : String,
        required : true
      },
      fieldofstudy :{
        type : String,
        required : true
      },
      from :{
        type : Date,
        required : true
      },
      to :{
        type : Date
      },
      current : {
        type : Boolean,
        default : false
      }
    }
  ],
  social:{
    instagram :{
      type:String
    },
    facebook:{
      type:String
    },
    linkedIn:{
      type:String
    },
    twitter :{
      type:String
    }
  }
})
module.exports = Profile = mongoose.model('profile',ProfileSchema);
