const router = require("express").Router();
const Media = require("../../schemas/media.js");
const path = require("path");
const assertAdmin = require("@/services/assert-admin");
const Subtitle = require("../../schemas/subtitles.js");
const WhisperJob = require("../../services/WhisperJob.js");
const { findById } = require("@/schemas/users.js");
const subtitles = require("../../schemas/subtitles.js");
const fs = require("fs").promises;

/**
 * Get /v1/medias/{mediaId}/subtitles
 * @summary Returns subtitles of a specific media by id of that media
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - Not authorized
 */
router.get("/:fileHash/subtitles", async (req, res) => {
    const media = await Media.findOne({fileHash: req.params.fileHash});
    if (media == null) {
        res.status(404);
        return res.send({ message: "Media with fileHash " + req.params.fileHash + " does not exist" });
    }

    if (media.subtitles != null) {
        for (let i=0; i<subtitles.length; i++){
            const subtitleIdObject = media.subtitles[i];
            console.log(subtitleIdObject);
            const id = subtitleIdObject.toString();
            console.log(id);
            const subtitle = await Subtitle.findById(id);
            console.log(subtitle);
            const filePath = subtitle.filePath;
            console.log(filePath);
            // Use Express's res.sendFile() method to send the file
            // Need to serve static files
            // return res.sendFile(filePath, (err) => {
            //     if (err) {
            //     // Handle errors, such as if the file doesn't exist
            //         return res.status(500).send({ message: "Error sending file" });
            //     }
            // });
            return res.send(filePath);
        }
    }
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
router.get("/:mediaId/subtitles/:subtitlesId", async (req, res) => {
    const media = await Media.findById(req.params.mediaId);
    if (media==null){
        res.status(404);
        return res.send({error: "Media with ID " + req.params.mediaId + " does not exist"});
    }
    const subtitle = await Subtitle.findById(req.params.subtitlesId);
    if (subtitle==null){
        res.status(404);
        return res.send({error: "Subtitles with ID " + req.params.subtitlesId + " does not exist"});
    }
    return res.send(subtitle);
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
        return res.status(400).send("No file uploaded");
    }
    const media = req.files.media;
    let fileType = media.name.split(".");
    if (fileType.length < 2)
        return res.status(400).send("File doesn't have a file extension");

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
            return res.status(500).send(err);
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
            .send(`Subtitle generation for media ${media.md5} started`);
    });
});

/**
 * Post /v1/medias/{mediaId}/subtitles
 * @summary Adds subtitles to media (not generated, but instead user-uploaded)
 * @tags medias
 * @param {File} subtitles.request.body.required - subtitles file in srt format
 * @return {object} 201 - Success response
 * @return {object} 400 - File not in srt format
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
        res.status(401).json({ error: "Not authorized" });
    }
});

/**
 * Delete /v1/medias/{fileHash}
 * @summary Deletes media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - not authorized
 */
router.delete("/:fileHash", async (req, res) => {
    //it deletes by id, but we want to delete by hash? or both?
    const media = await Media.findOne({fileHash: req.params.fileHash});
    Media.deleteOne({fileHash: req.params.fileHash});
    console.log(media);

    if (Media === null) {
        res.status(404);
        res.send({ error: "Media with ID " + req.params.id + " does not exist" });
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
        return res.send({error: "Media with ID " + req.params.mediaId + " does not exist"});
    }
    const subtitle = await Subtitle.findById(req.params.subtitlesId);
    if (subtitle==null){
        res.status(404);
        return res.send({error: "Subtitles with ID " + req.params.subtitlesId + " do not exist"});
    }
    if (subtitle.media!=req.params.mediaId){
        res.status(400);
        return res.send("Subtitles with ID " + req.params.subtitlesId + " do not belong to the media with ID " + req.params.mediaId);
    }
    Subtitle.findByIdAndDelete(req.params.subtitlesId);
    return res.send(subtitle.lean());
});

module.exports = router;
