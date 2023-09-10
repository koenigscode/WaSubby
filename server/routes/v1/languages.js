const router = require("express").Router();

/**
 * Get /v1/languages/
 * @summary Returns all languages
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * Query params:
 * filter: text to filter by
 * sort: "asc" or "desc"
 */
router.get("/", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Get /v1/languages/:code
 * @summary Returns a language by code
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.get("/:code", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Put /v1/languages/:code
 * @summary Updates language's name 
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * Update language display name (e.g. "English" to "English (US)")
 */
router.put("/:code", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
