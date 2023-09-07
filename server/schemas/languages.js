const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: { type: String },
    code: { type: String, unique: true, required: true }
}, {_id: false});


module.exports = languageSchema;