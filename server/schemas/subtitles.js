const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * filePath: path, where the subtitle is stored on the server's filesystem
 * subtitleLanguage: language of that subtitle
 * media: Media this subtitle belongs to
 */
const subtitleSchema = new Schema({
    filePath: { type: String, required: [true, "File path is required"] },
    language: {
        type: Schema.Types.ObjectId,
        ref: "Languages",
        required: [true, "Language is required"],
    },
});

module.exports = mongoose.model("Subtitles", subtitleSchema);
