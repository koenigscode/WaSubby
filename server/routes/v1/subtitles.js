const router = require("express").Router();
const assertAdmin = require("../../services/assert-admin");
const Subtitle = require("../../schemas/subtitles.js");

/**
 * Patch /v1/subtitles/{id}
 * @summary Partially updates subtitles
 * @tags subtitles
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - Subtitle ID not found
 * @return {object} 403 - no permission
 */
router.patch("/:id", assertAdmin, async (req, res) => {
    try {
        const subtitle = await Subtitle.findById(req.params.id);
        if (subtitle === null) {
            res.status(404);
            res.send({
                error: "Subtitles with ID " + req.params.id + " do not exist",
            });
        }

        const oldSubtitles = subtitle.toObject();
        const newSubtitleData = req.body;
        const id = req.params._id;

        await Subtitle.updateOne({ ...oldSubtitles, ...newSubtitleData, id });
        res.send(await Subtitle.findById(req.params.id));
    } catch (e) {
        console.log(e);
        res.status(400);
        res.send({ error: "Bad request" });
    }
});

/**
 * Delete /v1/subtitles/
 * @summary Deletes all subtitles
 * @tags subtitles
 * @return {object} 200 - Success response
 * @return {object} 403 - no permission
 */
router.delete("/", assertAdmin, async (req, res) => { 
    const deletedSubtitles = await Subtitle.find({}).lean();
    const result = await Subtitle.deleteMany({});
    const deletedCount = result.deletedCount;

    if (deletedCount > 0) {
        res.status(200).json(deletedSubtitles);
    } else {
        res.status(200).json({ message: "No subtitles to delete" });
    }
});

module.exports = router;
