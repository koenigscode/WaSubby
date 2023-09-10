const mongoose = require("mongoose");
const userSchema = require("./users");
const subtitleSchema = require("./subtitles");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
    FileHash: { type: String, unique: true, required: true },
    //Adding the uploader of the media
    user: {
        type: Schema.Types.ObjectId,
        ref: userSchema,
        required: true
    },
    //Referrencing the subtitle of the media
    mediaSubtitle: [{
        type: Schema.Types.ObjectId,
        ref: subtitleSchema }]
}, {_id: false});


module.exports = mediaSchema;