const mongoose = require("mongoose");
const mediaSchema = require("./media");
const Schema = mongoose.Schema;

/**
 * email: User email
 * password: User password (hashed)
 * theme: Persisted theme setting for frontend
 * uploadedMedia: Medias this user has uploaded
 */
const userSchema = new Schema({
    email: { type: String, required: [true, "Email must be set"], unique: true },
    password: { type: String, required: [true, "Password must be set"] },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    uploadedMedias: [{
        type: Schema.Types.ObjectId,
        ref: "Media"  }]
});

module.exports = userSchema;