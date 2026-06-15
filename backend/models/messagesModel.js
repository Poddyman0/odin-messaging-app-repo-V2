const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    messageBody: {type: String, required: true},
    timestamp: { type: Date, default: Date.now },
    image: { type: "String"},
    messageSentByProfile: { type: Schema.Types.ObjectId, ref: "Profile", required: true },
    conversationID: { type: Schema.Types.ObjectId, ref: "Conversation", required: true }
})

MessageSchema.virtual("url").get(function () {
    return `/message/${this._id}`;
  });

MessageSchema.virtual("timestamp_formatted").get(function () {
   return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});
  
MessageSchema.virtual("timestamp_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("Message", MessageSchema);
