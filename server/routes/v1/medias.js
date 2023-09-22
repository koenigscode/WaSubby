const router = require("express").Router();
const Media = require("../../schemas/media.js");
const path = require("path");
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
router.post("/", function (req, res) {
    if (!req.files || !req.files.media){
        return res.status(400).send("No file uploaded");
    } 
    const media = req.files.media;
    let fileType = media.name.split(".");
    if(fileType.length < 2)
        return res.status(400).send("File doesn't have a file extension");

    fileType = fileType[fileType.length - 1];

    const filePath = path.join("__dirname", "..", "/tmp", "/uploaded", `${media.md5}.${fileType}`);

    media.mv(filePath, err => {
        if (err) {
            return res.status(500).send(err);
        }

        const job = new WhisperJob(filePath, media.md5);
        job.execute().then(async () => {console.log(`Subtitle generation for ${media.md5} done`);
            await fs.unlink(filePath);
        });

        return res.status(201).send(`Subtitle generation for media ${media.md5} started`);
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
router.delete("/", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Delete /v1/medias/{mediaId}
 * @summary Deletes media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - not authorized
 */
router.delete("/:id", function (req, res) {
    res.status(501).send("TODO:");
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
router.delete("/:mediaId/subtitles/:subtitlesId", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
