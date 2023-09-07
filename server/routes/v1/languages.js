const router = require("express").Router()

/**
 * Get all languages
 *
 * Query params:
 * filter: text to filter by
 * sort: "asc" or "desc"
 */
router.get("/", function (req, res) {
  res.status(501).send("TODO:")
})

router.get("/:code", function (req, res) {
  res.status(501).send("TODO:")
})

/**
 * Update language display name (e.g. "English" to "English (US)")
 */
router.put("/:code", function (req, res) {
  res.status(501).send("TODO:")
})

module.exports = router
