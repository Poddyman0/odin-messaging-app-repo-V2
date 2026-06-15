const Profile = require("../models/profileModel")
const Message = require("../models/messagesModel")
const Conversation = require("../models/conversationModel")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const { trusted } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");

exports.conversation_create_post = [
    body("isGroup", "isGroup must be a boolean of either true or false")
    .isBoolean()
    .withMessage("isGroup must be a boolean of either true or false")
    .escape(),
    body("participants", "participants must contain at least 1 characters")
    .isArray()
    .withMessage('participants must have at least 1 character'),
    body("conversationName", "conversationName contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("conversationName must contain at least 1 characters")
    .escape(),
    asyncHandler(async (req, res, next) => {
        const aConversation = new Conversation({
            isGroup: req.body.isGroup,
            participants: req.body.participants,
            conversationName: req.body.conversationName,
          });
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.json({
                conversation: aConversation,
                errors: errors.array(),
                msg: "errors",
            }) 
          } else {
            await aConversation.save();
            res.json({
                conversation: aConversation,
                msg: "Conversation Created Successfully",
            })
          } 
    })
]

exports.conversation_get = asyncHandler(async (req, res, next) => {
    const aConversation = await Conversation.findById(req.params.id).exec();
    const allProfiles = await Profile.find({}).exec();
    const allMessages = await Message.find({}).exec()

    let aConversationCopy = {};
    aConversationCopy.isGroup = aConversation.isGroup,
    aConversationCopy.participants = [],
    aConversationCopy.conversationName = aConversation.conversationName,
    aConversationCopy.messages = []
    allProfiles.forEach(profile => {
    // only one profile coming through

        aConversation.participants.forEach(participant => {

            if (`${profile._id}` === `${participant}`) {
                aConversationCopy.participants.push(profile)
            }
        })
    })
    allMessages.forEach(message => {


        if (`${aConversation._id}` === `${message.conversationID}`) {
            let aMessageCopy = {}
            aMessageCopy._id = message._id,
            aMessageCopy.messageBody = message.messageBody
            aMessageCopy.timestamp = message.timestamp
            aMessageCopy.image = message.image
            aMessageCopy.messageSentByProfile = {}
            aMessageCopy.conversationID = message.conversationID
            allProfiles.forEach((profile) => {
                if (`${profile._id}` === `${message.messageSentByProfile}`) {
                    aMessageCopy.messageSentByProfile._id = profile._id,
                    aMessageCopy.messageSentByProfile.username = profile.username,
                    aMessageCopy.messageSentByProfile.profileSignedIn = profile.profileSignedIn
                }
            })
            aConversationCopy.messages.push(aMessageCopy)
        }
    })
    if (!aConversation) {
        res.json({
            conversation: aConversationCopy,
            msg: "Conversation get unsuccessfull as conversation does not exist"
        })
    } else {
        res.json({
            conversation: aConversationCopy,
            msg: "Conversation get successfull"
        })
    }
})

exports.conversation_update_post = [
    body("isGroup", "isGroup must be a boolean of either true or false")
    .isBoolean()
    .withMessage("isGroup must be a boolean of either true or false")
    .escape(),
    body("participants", "participants must contain at least 1 characters")
    .isArray()
    .withMessage('participants must have at least 1 character'),
    body("conversationName", "conversationName contain at least 1 characters")
    .trim()
    .isLength({ min: 1 })
    .withMessage("conversationName must contain at least 1 characters")
    .escape(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const conversationToUpdate = Conversation.findById(req.params.id).exec();
        const aConversation = new Conversation({
            isGroup: req.body.isGroup,
            participants: req.body.participants,
            conversationName: req.body.conversationName,
            _id: req.params.id, // This is required, or a new ID will be assigned!
          });
          if (!errors.isEmpty()) {
            res.json({
                conversation: conversationToUpdate,
                errors: errors.array(),
                msg: "errors",
            }) 
          } else {
            await Conversation.findByIdAndUpdate(req.params.id, aConversation, {});
            res.json({
                conversation: aConversation,
                msg: "conversation Updated Successfully",
            })
          }      
        })
]

exports.conversation_delete_post = asyncHandler(async (req, res, next) => {
    const aConversationExists = await Conversation.findById(req.params.id).exec();
    let errors = []
    let conversationIDToDelete = req.params.id
    if (conversationIDToDelete === null) {
        errors.push("Conversation ID does not exist")
        res.json({
            conversation: aConversationExists,
            errors: errors,
            msg: "Error"
        })
    } else {
        const aConversation = await Conversation.findByIdAndDelete(req.params.id).exec();
        res.json({
            conversation: aConversation,
            msg: "Conversation deleted successfully" 
        })
    }
})

exports.conversations_get_by_userID = asyncHandler(async (req, res, next) => {
    const conversation = await Conversation.find({}).exec()
    const allProfiles = await Profile.find({}).exec();

    let allConversations = []

    conversation.forEach((conversation) => {
        conversation.participants.forEach((participantID) => {

            //

            if (`${participantID}` === `${req.params.id}`) {
                let aConversation = {}
                aConversation._id = conversation._id,
                aConversation.conversationName = conversation.conversationName,
                aConversation.isGroup = conversation.isGroup
                aConversation.participants = []
                conversation.participants.forEach(participantIdentity => {
                    allProfiles.forEach((profile) => {
                        if (`${profile._id}` === `${participantIdentity}`) {
                            let aProfileCopy = {
                                username: profile.username,
                                email: profile.email,
                                profileSignedIn: profile.profileSignedIn
                            }
                            aConversation.participants.push(aProfileCopy)
                        }
                    })
                })


                


                allConversations.push(aConversation)

            }
            //
        })
    })
    console.log("allConversations", allConversations)

    if (!conversation) {
        res.json({
            conversations: allConversations,
            msg: "Conversation get unsuccessfull as message does not exist"
        })
    } else {
        res.json({
            conversations: allConversations,
            msg: "Messages get successfull"
        })
    }
})