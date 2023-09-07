const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    FileHash: { type: String, unique: true, required: true }
}, {_id: false});


module.exports = mediaSchema;