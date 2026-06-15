const Profile = require("../models/profileModel")
const Message = require("../models/messagesModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { trusted } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
//done
//POST request for creating a profile
exports.profile_create_post = [
    body("username", "username contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("username must contain at least 1 characters")
    .escape(),
    body("email", "email must be a valid email")
    .trim()
    .isEmail()
    .withMessage("email must be a valid email")
    .escape(),
    body("password", "password must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("password must contain at least 1 characters")
    .escape(),
    body("profileSignedIn", "profileSignedIn must be a boolean of either true or false")
    .isBoolean()
    .withMessage("profileSignedIn must be a boolean of either true or false")
    .escape(),
    body("friends", "friends must contain at least 1 characters")
    .isArray().withMessage('friends must have at least 1 character'),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
              errors: errors.array(),
              msg: "Validation errors occurred",
            });
          }
        
          const passwordToHash = req.body.password;
          try {
            const salt = bcrypt.genSaltSync(12);
            const hashedPassword = bcrypt.hashSync(passwordToHash, salt);
      
            const aProfile = new Profile({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                profileSignedIn: req.body.profileSignedIn,
                friends: req.body.friends
              
            });
      
            await aProfile.save();
            res.json({
              profile: aProfile,
              msg: "Profile Created Successfully",
            });
          } catch (err) {
            next(err);
          }
    })
]


//POST request to update a profile
exports.profile_update_post = [
    body("username", "username contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("username must contain at least 1 characters")
    .escape(),
    body("email", "email must be a valid email")
    .trim()
    .isEmail()
    .withMessage("email must be a valid email")
    .escape(),
    body("password", "password must contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("password must contain at least 1 characters")
    .escape(),
    body("friends", "friends must contain at least 1 characters")
    .isArray()
    .withMessage('friends must have at least 1 character'),

    asyncHandler(async (req, res, next) => {
        const salt = bcrypt.genSaltSync(12);
        const passwordToHash = req.body.password
        const hashedPassword = bcrypt.hashSync(passwordToHash, salt);
              const errors = validationResult(req);
              const aProfile = new Profile({
                username: req.body.profileName,
                email: req.body.profileEmail,
                password: hashedPassword,
                _id: req.params.id,
            });
            if (!errors.isEmpty()) {
                res.json({
                    profile: aProfile,
                    errors: errors.array(),
                    msg: "errors",
                }) 
              } else {
                await Profile.findByIdAndUpdate(req.params.id, aProfile, {});
                res.json({
                    profile: aProfile,
                    msg: "Profile Updated Successfully",
                })
              } 
    })
]

//POST request to delete a profile

exports.profile_delete_post = asyncHandler(async (req, res, next) => {
    const aProfileExists = await Profile.findById(req.params.id)
    let errors = []
    let profileIDToDelete = req.params.id
    if (profileIDToDelete === null) {
        errors.push("Profile ID does not exist")
        res.json({
            profile: aProfileExists,
            errors: errors,
            msg: "Error"
        })
    } else {
        const aProfile = await Profile.findByIdAndDelete(req.params.id).exec();
        res.json({
            profile: aProfile,
            msg: "Profile deleted successfully" 
        })
    }
})

// GET request to get a Profile by ID.
exports.profile_get_id = asyncHandler(async (req, res, next) => {
  const aProfile = await Profile.findById(req.params.id).exec();
  const allProfiles = await Profile.find({}).exec();
    let aProfileCopy = {}
    aProfileCopy._id = aProfile._id
    aProfileCopy.username = aProfile.username
    aProfileCopy.email = aProfile.email
    aProfileCopy.profileSignedIn = aProfile.profileSignedIn
    aProfileCopy.friends = []
    aProfile.friends.forEach((friend) => {
      let friendID = `${friend}`
      allProfiles.forEach((user) => {
        let profileID = `${user._id}`
          if (friendID === profileID) {
            let friendDetails = {}
            friendDetails._id = user._id,
            friendDetails.username = user.username
            friendDetails.email = user.email
            friendDetails.profileSignedIn = user.profileSignedIn
            aProfileCopy.friends.push(friendDetails)
          }
      })
    })
    if (!aProfile) {
        res.json({
            profile: aProfileCopy,
            msg: "Profile get unsuccessfull as profile does not exist"
        })
    } else {

        res.json({
            profile: aProfileCopy,
            msg: "Profile get successfull"
        })
    }
})


//here
//GET request to get a Profile by email
exports.profile_get_email = asyncHandler(async (req, res, next) => {
  const aProfile = await Profile.find({ email: req.params.email}).exec();
  if (!aProfile) {
      res.json({
          profile: aProfile,
          msg: "Profile get unsuccessfull as profile does not exist"
      })
  } else {
      res.json({
        profile: aProfile,
        msg: "Profile get successfull"
      })
  }
})

// GET request to get all profiles.
exports.profiles_get = asyncHandler(async (req, res, next) => {
    const profiles = await Profile.find({}).exec();
    let allProfiles = []
    let aProfile = {}
    profiles.forEach(profile => {
      aProfile = {}
      aProfile.username = profile.username,
      aProfile.email = profile.email,
      aProfile.profileSignedIn = profile.profileSignedIn,
      aProfile._id = profile._id
      allProfiles.push(aProfile)
    })
  
    if (!profiles) {
        res.json({
            profiles: allProfiles,
            msg: "Profiles get unsuccessfull as profile does not exist"
        })
    } else {
      if (allProfiles.length === profiles.length) {
        res.json({
          profiles: allProfiles,
          msg: "Profiles get successfull"
      })
      }
  
    }
  })


// POST request to update and sign out of  a Profile.
exports.profile_sign_out_post_JWTBycrypt = [

  asyncHandler(async (req, res, next) => {

    const aProfile = await Profile.findById(req.params.id);

    if (!aProfile) {
      return res.json({ msg: "Incorrect ID" });
    } else if (aProfile) {
      await Profile.findByIdAndUpdate(req.params.id, {
        profileSignedIn: false,
      });
      res.json({
        msg: "Profile signed out successfully",
      });
      
    } 

  })

];

  

// GET request to sign in to a profile.
////

///here
// POST request to update and sign in to a profile
exports.profile_sign_in_post_JWTBycrypt = [
body("email", "email must be a valid email")
.trim()
.isEmail()
.withMessage("email must be a valid email")
.escape(),
body("password", "password must contain at least 1 characters")
.trim()
.isLength({ min: 1 })
.withMessage("password must contain at least 1 characters")
.escape(),
asyncHandler(async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.json({
      errors: errors.array(),
      msg: "errors",
    });
  }

  const profileDB = await Profile.findOne({
    email: req.body.email
  }).exec();

  if (!profileDB) {
    return res.json({ msg: "Incorrect email" });
  }

  const isMatch = bcrypt.compareSync(
    req.body.password,
    profileDB.password
  );

  if (!isMatch) {
    return res.json({ msg: "Incorrect password" });
  }

  const token = jwt.sign(
    { userID: profileDB._id },
    process.env.JWT_PASSWORD
  );


  res.json({
    profile: profileDB,
    userIDSignInCreated: profileDB._id,
    msg: "JWT Auth Creation Passed",
    token: token,
  });

})
]

exports.profile_sign_out_post_passport = [
  asyncHandler(async (req, res, next) => {
      req.logout((err) => {
        if (err) {
          return next(err); // Passes any errors to the error handler
        }
      })
      res.json({
        msg: "Profile signed out successfully",
      });
    })
]
//is this a route
exports.profile_sign_in_post_passport = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("email must be a valid email")
    .escape(),

  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("password must contain at least 1 characters")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    next();
  }),

  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);

      if (!user) {
        return res.json({ msg: "Login failed" });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);

        return res.json({
          msg: "Session login success",
          user,
        });
      });

    })(req, res, next); 
  }
];

  //

