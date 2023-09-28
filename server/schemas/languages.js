const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * code: Language code (e.g. de)
 * name: Display name (e.g. German)
 *   unique, because whisper logs the display name,
 *   so we have to map name -> code
 */
const languageSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: [true, "Language code required"],
    },
    name: {
        type: String,
        unique: true,
        required: [true, "Language name required"],
    },
});

module.exports = mongoose.model("Languages", languageSchema);
