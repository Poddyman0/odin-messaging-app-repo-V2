const Profile = require("../models/profileModel")
const Message = require("../models/messagesModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { trusted } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')

/*
friends array:
// GET request to get a event.
getAAtendeeForAEvent
getAInviteeForAEvent
*/



//GET request to get a message
exports.message_get = asyncHandler(async (req, res, next) => {
    const aMessage = await Message.findById(req.params.id).exec();
    const allProfiles = await Profile.find({}).exec();
    let aMessageCopy = {};
    aMessageCopy._id = aMessage._id,
    aMessageCopy.messageBody = aMessage.messageBody
    aMessageCopy._id = aMessage._id
    aMessageCopy.timestamp = aMessage.timestamp
    aMessageCopy.messageSentByProfile = {},
    console.log("amsg", aMessage)
    //edit
    aMessageCopy.conversationID = aMessage.conversationID,

    allProfiles.forEach((profile) => {

        if (`${profile._id}` === `${aMessage.messageSentByProfile}`) {
            aMessageCopy.messageSentByProfile = profile

        }

    })


     if (!aMessage) {
        res.json({
            message: aMessageCopy,
            msg: "Message get unsuccessfull as message does not exist"
        })
    } else {
        res.json({
            message: aMessageCopy,
            msg: "message get successfull"
        })
    }
})

// POST request to create a message.
exports.message_create_post = [
    body("messageBody", "messageBody must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('messageBody must have at least 1 character'),
    body("messageSentByProfile", "messageSentByProfile must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('messageSentByProfile must have at least 1 character'),
    body("conversationID", "conversationID must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('conversationID must have at least 1 character'), 
    body("image", "image must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('image must have at least 1 character'),   
    asyncHandler(async (req, res, next) => {
        const aMessage = new Message({
            messageBody: req.body.messageBody,
            messageSentByProfile: req.body.messageSentByProfile,
            conversationID: req.body.conversationID,
            image: req.body.image
          });
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.json({
                message: aMessage,
                errors: errors.array(),
                msg: "errors",
            }) 
          } else {
            await aMessage.save();
            res.json({
                message: aMessage,
                msg: "Message Created Successfully",
            })
          } 
    })
]




//POST request to update a message
exports.message_update_post = [
    body("messageBody", "messageBody must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('messageBody must have at least 1 character'),
    body("image", "image must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('image must have at least 1 character'),
    body("messageSentByProfile", "messageSentByProfile must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('messageSentByProfile must have at least 1 character'),
    body("conversationID", "conversationID must contain at least 1 characters")
        .isLength({ min: 1 }).withMessage('conversationID must have at least 1 character'),  
        asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const messageToUpdate = Message.findById(req.params.postID).exec();
    const aMessage = new Message({
        messageBody: req.body.messageBody,
        image: req.body.image,
        messageSentByProfile: req.body.messageSentByProfile,
        conversationID: req.body.conversationID,
        _id: req.params.id, // This is required, or a new ID will be assigned!
      });
      if (!errors.isEmpty()) {
        res.json({
            message: messageToUpdate,
            errors: errors.array(),
            msg: "errors",
        }) 
      } else {
        await Message.findByIdAndUpdate(req.params.id, aMessage, {});
        res.json({
            message: aMessage,
            msg: "message Updated Successfully",
        })
      }      
    })
]

// POST request to delete a message.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
    const aMessageExists = await Message.findById(req.params.id).exec();
    let errors = []
    let messageIDToDelete = req.params.id
    if (messageIDToDelete === null) {
        errors.push("Message ID does not exist")
        res.json({
            message: aMessageExists,
            errors: errors,
            msg: "Error"
        })
    } else {
        const aMessage = await Message.findByIdAndDelete(req.params.id).exec();
        res.json({
            message: aMessage,
            msg: "Message deleted successfully" 
        })
    }
})