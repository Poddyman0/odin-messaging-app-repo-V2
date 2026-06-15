const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    isGroup: {type: Boolean, required: true},
    participants: [{ type: Schema.Types.ObjectId, ref: "Profile", required: true }],
    conversationName: { type: String, required: true},
})

module.exports = mongoose.model("Conversation", ConversationSchema);