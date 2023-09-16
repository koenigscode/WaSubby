const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

/**
 * email: User email
 * password: User password (hashed)
 * theme: Persisted theme setting for frontend
 * uploadedMedia: Medias this user has uploaded
 */
const userSchema = new Schema({
    email: { type: String, required: [true, "Email must be set"], unique: true },
    password: { type: String, required: [true, "Password must be set"] },
    admin : {type: Boolean, default: false}, 
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    uploadedMedias: [{
        type: Schema.Types.ObjectId,
        ref: "Media"  }]
});
userSchema.pre(
    "save",
    async function(next) {
        const hash = await bcrypt.hash(this.password, 10);
  
        this.password = hash;
        next();
    }
);

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
};

module.exports = mongoose.model("Users", userSchema);