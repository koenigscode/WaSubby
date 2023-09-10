const mongoose = require("mongoose");
const languageSchema = require("./languages");
const mediaSchema = require("./media");
const Schema = mongoose.Schema;

const subtitleSchema = new Schema({
    filePath: { type: String, required: true },
    //Adding a relationship with the uploaded media
    subtitleLanguage: [{
        type: Schema.Types.ObjectId,
        ref: languageSchema }],
    media: {
        type: Schema.Types.ObjectId,
        ref: mediaSchema,
        required: true
    }
        
});


module.exports = subtitleSchema;