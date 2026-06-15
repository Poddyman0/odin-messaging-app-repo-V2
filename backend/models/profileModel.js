const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profileSignedIn: {type: Boolean, required: true},
    friends: [{type: Schema.Types.ObjectId, ref: "Profile"}]
})

ProfileSchema.virtual("profileID").get(function () {
  return this._id
})

ProfileSchema.virtual("aProfileURL").get(function () {
  return `/catalog/profile/get/${this._id}/profile`
});

module.exports = mongoose.model("Profile", ProfileSchema);