const router = require("express").Router()

router.get("/:id/subtitles", function (req, res) {
  res.status(501).send("TODO:")
})

router.get("/:mediaId/subtitles/:subtitlesId", function (req, res) {
  res.status(501).send("TODO:")
})

/**
 * Adds media and generates subtitles for it
 *
 * Body params:
 * transcribe: boolean, if the media should be transcribed in the original language
 * translate: boolean, if the media should be translated into english
 */
router.post("/:mediaId", function (req, res) {
  res.status(501).send("TODO:")
})

/**
 * Adds subtitles to media (not generated, but instead user-uploaded)
 */
router.post("/:id/subtitles", function (req, res) {
  res.status(501).send("TODO:")
})

router.delete("/", function (req, res) {
  res.status(501).send("TODO:")
})

router.delete("/:id", function (req, res) {
  res.status(501).send("TODO:")
})

router.delete("/:mediaId/subtitles/:subtitlesId", function (req, res) {
  res.status(501).send("TODO:")
})

module.exports = router
