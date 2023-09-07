const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: [true, "Email must be set!"], unique: true },
    password: { type: String, required: [true, "Password must be set!"] },
    theme: { type: String, enum: ["light", "dark"], default: "light" }
});

module.exports = userSchema;