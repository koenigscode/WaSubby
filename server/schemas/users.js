const mongoose = require("mongoose");
const mediaSchema = require("./media");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: [true, "Email must be set!"], unique: true },
    password: { type: String, required: [true, "Password must be set!"] },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    //Adding a relationship with the uploaded media
    uploadedMedia: [{
        type: Schema.Types.ObjectId,
        ref: mediaSchema  }]
});

module.exports = userSchema;