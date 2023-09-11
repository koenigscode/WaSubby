const router = require("express").Router();



/**
 * Get /v1/medias/{mediaId}/subtitles
 * @summary Returns subtitles of a specific media by id of that media
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.get("/:id/subtitles", function (req, res) {
    res.status(501).send("TODO:");
});


/**
 * Get /v1/medias/{mediaId}/subtitles/{subtitlesId}
 * @summary Returns the id of specific subtitles of a media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.get("/:mediaId/subtitles/:subtitlesId", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Post /v1/medias/{mediaId}
 * @summary Adds media and generates subtitles for it
 * @tags medias
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post("/:mediaId", function (req, res) {
    res.status(501).send("TODO:");
});


/**
 * Post /v1/medias/{mediaId}/subtitles
 * @summary Adds subtitles to media (not generated, but instead user-uploaded)
 * @tags medias
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post("/:id/subtitles", function (req, res) {
    res.status(501).send("TODO:");
});


/**
 * Delete /v1/medias
 * @summary Deletes all medias
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.delete("/", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Delete /v1/medias/{mediaId}
 * @summary Deletes media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.delete("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Delete /v1/medias/{mediaId}/substitles/{subtitlesId}
 * @summary Deletes subtitles by id of a specific media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.delete("/:mediaId/subtitles/:subtitlesId", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
