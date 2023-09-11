const router = require("express").Router();

/**
 * Get /v1/languages/
 * @summary Returns all languages
 * @tags languages
 * @param {string} filter.query - text to filter by
 * @param {string} sort.query - asc / desc
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.get("/", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Get /v1/languages/{code}
 * @summary Returns a language by code
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 404 - Not found
 */
router.get("/:code", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Get /v1/languages/{name}
 * @summary Returns a language by display name
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.get("/:name", function (req, res) {
    res.status(501).send("TODO:");
});


/**
 * Put /v1/languages/{code}
 * @summary Updates language's display name 
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.put("/:code", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
