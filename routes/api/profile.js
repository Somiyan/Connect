const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

router.get('/me', auth ,
async (req,res) => {
  try{
  const profile = await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);

  if(!profile){
    return res.status(400).json({msg : 'There is no profile for this user'})
  }

  res.json(profile)
} catch(err){
  console.error(err.message);
  res.status(500).send("Server Error")
}
});

router.post('/',
[
  auth,[
    check('skills','skill is required').not().isEmpty()
  ]
],
async (req ,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors : errors.array() });
  }

  const
  {
    company,
    website,
    status,
    location,
    skills,
    bio,
    instagram,
    facebook,
    linkedIn,
    twitter
  } = req.body;

  const profileFields = {};
  profileFields.user = req.user.id;
  if(company) profileFields.company = company;
  if(website) profileFields.website = website;
  if(status) profileFields.status = status;
  if(location) profileFields.location = location;
  if(bio) profileFields.bio = bio;
  if(skills){
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }

  profileFields.social = {};
  if(instagram) profileFields.social.instagram = instagram;
  if(facebook) profileFields.social.facebook = facebook;
  if(linkedIn) profileFields.social.linkedIn = linkedIn;
  if(twitter) profileFields.social.twitter = twitter;

  try{
    const profile = await Profile.findOne({user : req.user.id});

// update profile
    if(profile){
      profile = await Profile.findOneAndUpdate(
        {user : req.user.id},
        {$set : profileFields},
        {new : true}
      );

    return res.json(profile)
    }else{
      return res.status(400).json({msg : "Profile Not Found" });
    }
// Create profile
    profile = new Profile(profileFields);

    await profile.save();

    res.json(profile);

  } catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})
// GET all profiles
router.get('/', async (req , res) =>{

  try{
    const profiles = await Profile.find().populate('user',['name','avatar']);
    res.json(profiles)

  } catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})
// GET user profile
router.get('/user/:user_id', async (req , res) =>{

  try{
    const profile = await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);

    if(!profile){
      return res.status(400).json({msg : "Profile Not Found" });
    }
    res.json(profile)

  } catch(err){
    console.error(err.message);
    if(err.kind === 'ObjectId'){
      return res.status(400).json({msg : "Profile Not Found" });
    }
    res.status(500).send("Server error");
  }
})
// Delete user and profiles

router.delete('/', auth , async (req , res) =>{

  try{
    await Profile.findOneAndRemove({user : req.user.id});

    await User.findOneAndRemove({_id : req.user.id });

    res.json({msg : 'User removed'})

  } catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})
// PUT Education fieldofstudy
router.put('/education',
[
  auth,[
    check('school','school is required').not().isEmpty(),
    check('degree','degree is required').not().isEmpty(),
    check('fieldofstudy','field of study is required').not().isEmpty(),
    check('from','from date is required').not().isEmpty()
  ]
],
async (req ,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors : errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current
  }
  try{
    const profile = await Profile.findOne( { user : req.user.id})

    profile.education.unshift(newEdu)

    await profile.save();

    res.json(profile)

  } catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})

router.delete('/education/:edu_id', auth , async (req , res) =>{

  try{
    const profile = await Profile.findOne({user : req.user.id});

    const removeIndex = profile.education.map(item => item.id).indexOf(req.param.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save()
    res.json(profile)

  } catch(err){
    console.error(err.message);
    res.status(500).send("Server error");
  }
})


module.exports = router;
