const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const Medias = require("./medias.js");

/**
 * email: User email
 * password: User password (hashed)
 * theme: Persisted theme setting for frontend
 * uploadedMedia: Medias this user has uploaded
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email must be set"],
        unique: true,
        // regex source: https://regexr.com/3e48o
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "This is not a valid email address"],
    },
    password: { type: String, required: [true, "Password must be set"] },
    admin: { type: Boolean, default: false },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    uploadedMedias: [
        {
            type: Schema.Types.ObjectId,
            ref: "Medias",
        },
    ],
});

userSchema.pre("deleteOne", { document: true }, async function (next) {
    // can't just use Media.deleteMany, because we need a document method call
    // so that the pre hook is called
    for (let media of this.uploadedMedias) {
        media = await Medias.findOne({ _id: media._id });
        await media.deleteOne({ _id: media._id });
    }
    next();
});

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
};

module.exports = mongoose.model("Users", userSchema);
