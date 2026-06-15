const express = require('express');
const router = express.Router();
const jwtAuth = require('../jwtAuth')
const messages_controller = require("../controllers/messagesController");
const profile_controller = require("../controllers/profileController");
const conversation_controller = require("../controllers/conversationController")
const passport = require("passport");


router.post(
    `/profile/put/signin/:id`,
    passport.authenticate("local", {
      successRedirect: `/profile/get/:id/aprofileID`,
      failureRedirect: `/profile/put/signin/:id`
    })
  );
//done
// POST request for creating profile
router.post("/profile/post",
profile_controller.profile_create_post
)
//done
// POST request to update Profile.
router.post("/profile/put/:id/profileupdate", jwtAuth,
profile_controller.profile_update_post
);
//done
// POST request to delete a profile
router.post("/profile/delete/:id", jwtAuth,
profile_controller.profile_delete_post
)

//done
// GET request to get a Profile by ID
router.get("/profile/get/:id/aprofileID", jwtAuth, 
profile_controller.profile_get_id
)


// done
// GET request to get all profiles.
router.get("/profiles/get", jwtAuth, 
profile_controller.profiles_get
)
//done
// POST JWT / Bycrypt request to update and sign out of  a Profile.
router.post("/profile/put/signout/:id/JWTBycrypt", jwtAuth,
profile_controller.profile_sign_out_post_JWTBycrypt
)

// POST JWT / Bycrypt  request to login user and return token
router.post("/profile/put/signin/:id/JWTBycrypt", 
profile_controller.profile_sign_in_post_JWTBycrypt
);

// POST passport request to update and sign out of  a Profile.
router.post("/profile/put/signout/:id/passport",
profile_controller.profile_sign_out_post_passport
)

// POST passport request to login user using passport
router.post("/profile/put/signin/:id/passport", 
profile_controller.profile_sign_in_post_passport
);


///

//done
// GET request to get a profile by email
router.get("/profile/get/aprofileEmail/:email",
profile_controller.profile_get_email
)

//done



///

//done
// POST request to create a message.
router.post("/message/post", jwtAuth, 
messages_controller.message_create_post
)
//done
// GET request to get a message.
router.get("/message/get/:id/amessage", jwtAuth,
messages_controller.message_get
)
//done
// POST request to update a message.
router.post("/message/put/:id/messageupdate", jwtAuth,
messages_controller.message_update_post
)
//done
// POST request to delete a message.
router.post("/message/delete/:id", jwtAuth, 
messages_controller.message_delete_post
)
//done

//

//done
//POST request to create a conversation
router.post("/conversation/post", jwtAuth, 
conversation_controller.conversation_create_post
)
//done
//GET request to get a conversation
router.get("/conversation/get/:id/aconversation", jwtAuth, 
conversation_controller.conversation_get
)
//done
//POST request to update a conversation
router.post("/conversation/put/:id/conversationupdate", jwtAuth,
conversation_controller.conversation_update_post
)
//done
//POST reqest to devete a conversation
router.post("/conversation/delete/:id", jwtAuth, 
conversation_controller.conversation_delete_post
)

//GET request to get a conversation by userID
router.get("/conversation/get/conversations/:id", jwtAuth, 
conversation_controller.conversations_get_by_userID
)


module.exports = router;