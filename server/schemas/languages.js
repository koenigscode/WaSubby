const mongoose = require("mongoose");
const subtitleSchema = require("./subtitles");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    name: { type: String },
    code: { type: String, unique: true, required: true },
    //Adding the subtitle that is written as this language
    subtitle: {
        type: Schema.Types.ObjectId,
        ref: subtitleSchema,
        required: true
    }
}, {_id: false});


module.exports = languageSchema;