const mongoose = require("mongoose");
const subtitleSchema = require("./subtitles");
const Schema = mongoose.Schema;

/**
 * fileHash: The file hash of the media file
 *   Only the hash is stored, as storing all media files is
 *   unnecessary and takes up too much storage. 
 */
const mediaSchema = new Schema({
    fileHash: { type: String, unique: true, required: [true, "File hash required"] },
    subtitles: [{
        type: Schema.Types.ObjectId,
        ref: "Subtitle" }]
}, {_id: false});


module.exports = mediaSchema;