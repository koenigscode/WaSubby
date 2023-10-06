const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subtitles = require("./subtitles.js");

/**
 * fileHash: The file hash of the media file
 *   Only the hash is stored, as storing all media files is
 *   unnecessary and takes up too much storage.
 */
const mediaSchema = new Schema(
    {
        fileHash: {
            type: String,
            unique: true,
            required: [true, "File hash required"],
        },
        subtitles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subtitles",
            },
        ],
        processing: {
            type: Boolean,
            default: true, 
        },
        
    },
);

mediaSchema.pre("deleteOne", { document: true }, async function (next) {
    for (let subtitle of this.subtitles) {
        subtitle = await Subtitles.findOne({ _id: subtitle._id });
        await subtitle.deleteOne({ _id: subtitle._id });
    }
    next();
});

module.exports = mongoose.model("Medias", mediaSchema);
