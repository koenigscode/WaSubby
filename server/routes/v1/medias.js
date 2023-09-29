const router = require("express").Router();
const Media = require("../../schemas/media.js");
const path = require("path");
const assertAdmin = require("@/services/assert-admin");
const Subtitle = require("../../schemas/subtitles.js");
const WhisperJob = require("../../services/WhisperJob.js");
const fs = require("fs").promises;

/**
 * Get /v1/medias/{mediaId}/subtitles
 * @summary Returns subtitles of a specific media by id of that media
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - Not authorized
 */
router.get("/:id/subtitles", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Get /v1/medias/{mediaId}/subtitles/{subtitlesId}
 * @summary Returns the specific subtitles of a media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 404 - subtitlesId not found
 * @return {object} 401 - Not authorized
 */
router.get("/:mediaId/subtitles/:subtitlesId", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Post /v1/medias
 * @summary Adds media and generates subtitles for it
 * @tags medias
 * @param {File} media.request.body.required - media for which the subtitles are generated
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 401 - Not authorized
 */
router.post("/", async (req, res) => {
    if (!req.files || !req.files.media) {
        return res.status(400).json({message: "No file uploaded"});
    }

    const media = req.files.media;

    if(Media.findOne({fileHash: media.md5}).length > 0) {
        return res.status(200).json({media: media.md5, message: "Subtitles for this media already exist"});
    }

    let fileType = media.name.split(".");
    if (fileType.length < 2)
        return res.status(400).json({message: "File doesn't have a file extension"});

    fileType = fileType[fileType.length - 1];

    const fileName = `${media.md5}.${fileType}`;

    const filePath = path.join(
        "__dirname",
        "..",
        "/tmp",
        "/uploaded",
        fileName,
    );
    

    media.mv(filePath, (err) => {
        if (err) {
            return res.status(500).json({message: err});
        }
        
        const job = new WhisperJob(filePath, media.md5);
        job.execute().then(async (subs) => {console.log(`Subtitle generation for ${media.md5} done`);
            await fs.unlink(filePath);
            const subtitlePath = subs[0].path;
            const language = subs[0].language;
            const newMedia = new Media({fileHash: media.md5});
            const newSubtitles = new Subtitle({filePath: subtitlePath, language: language, media: newMedia});
            newMedia.subtitles = newSubtitles;
            newMedia.save();
            newSubtitles.save();
        });
        
        return res
            .status(201)
            .json({media: media.md5, message: "Subtitle generation started"});
    });
});

/**
 * Post /v1/medias/{mediaId}/subtitles
 * @summary Adds subtitles to media (not generated, but instead user-uploaded)
 * @tags medias
 * @param {File} subtitles.request.body.required - subtitles file in vtt format
 * @return {object} 201 - Success response
 * @return {object} 400 - File not in vtt format
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - Not authorized
 */
router.post("/:id/subtitles", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Delete /v1/medias
 * @summary Deletes all medias
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 401 - not authorized
 */
router.delete("/", assertAdmin, async (req, res) => {
    try {
        const deletedMedias = await Media.find({}).lean();
        const result = await Media.deleteMany({});
        const deletedCount = result.deletedCount;

        if (deletedCount > 0) {
            res.status(200).json(deletedMedias);
        } else {
            res.status(200).json({ message: "No medias to delete" });
        }
    } catch (err) {
        console.error(err);
        res.status(401);
    }
});

/**
 * Delete /v1/medias/{mediaId}
 * @summary Deletes media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - not authorized
 */
router.delete("/:id", async (req, res) => {
    //it deletes by id, but we want to delete by hash? or both?
    const media = await Media.findByIdAndDelete(req.params.id);
    console.log(media);

    if (Media === null) {
        res.status(404);
        res.send({ message: "Media with ID " + req.params.id + " does not exist" });
    }

    res.send(media);
});

/**
 * Delete /v1/medias/{mediaId}/subtitles/{subtitlesId}
 * @summary Deletes subtitles by mediaId and subtitlesId
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - subtitleId not found
 * @return {object} 404 - mediaId not found
 * @return {object} 403 - no permission
 */
router.delete("/:mediaId/subtitles/:subtitlesId", async (req, res) => {
    // TODO: only allow if user owns media or is admin
    const media = await Media.findById(req.params.mediaId);
    if (media==null){
        res.status(404);
        return res.send({message: "Media with ID " + req.params.mediaId + " does not exist"});
    }
    const subtitle = await Subtitle.findById(req.params.subtitlesId);
    if (subtitle==null){
        res.status(404);
        return res.send({message: "Subtitles with ID " + req.params.subtitlesId + " do not exist"});
    }
    if (subtitle.media!=req.params.mediaId){
        res.status(400);
        return res.send("Subtitles with ID " + req.params.subtitlesId + " do not belong to the media with ID " + req.params.mediaId);
    }
    Subtitle.findByIdAndDelete(req.params.subtitlesId);
    return res.send(subtitle.lean());
});

module.exports = router;
