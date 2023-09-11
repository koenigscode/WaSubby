const router = require("express").Router();


/**
 * Patch /v1/subtitles/{id}
 * @summary Partially updates subtitles
 * @tags subtitles
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.patch("/:id", function (req, res) {
    res.status(501).send("TODO:");
});


/**
 * Delete /v1/subtitles/
 * @summary Deletes all subtitles
 * @tags subtitles
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.delete("/", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
