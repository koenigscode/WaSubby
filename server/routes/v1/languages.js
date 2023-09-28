const router = require("express").Router();
const Language = require("../../schemas/languages.js");
const passport = require("passport");
const assertAdmin = require("@/services/assert-admin");


/**
 * Get /v1/languages
 * @summary Returns all languages
 * @tags languages
 * @param {string} filter.query - text to filter by
 * @param {string} sort.query - asc / desc
 * @return {object} 200 - Success response
 */
router.get("/", async (req, res) => {
    const languages = await Language.find().select("-__v");
    res.send(languages);
});

/**
 * Get /v1/languages/{code}
 * @summary Returns a language by code
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 404 - language code not found
 */
router.get("/:code", async (req, res) => {
    const language = await Language.findOne({ code: req.params.code }).select(
        "-__v",
    );
    res.send(language);
});

/**
 * Put /v1/languages/{code}
 * @summary Updates language's display name
 * @tags languages
 * @param {string} newName.request.body.required - new display name
 * @return {object} 200 - Success response
 * @return {object} 403 - No permission
 * @return {object} 404 - Language code not found
 */
router.put("/:code", 
    passport.authenticate("jwt", { session: false }),
    assertAdmin,
    async function (req, res) {
        try {
            const language = await Language.findOne({code: req.params.code});
            if (language === null) {
                res.status(404);
                res.send({ message: "Language with code " + req.params.code + " does not exist" });
            }

            const newLanguageData = req.body;
            const id = req.params._id;
            await Language.updateOne({...newLanguageData, id });
            res.send(await Language.findOne({code: req.params.code}).select("-__v"));
        } catch (e) {
            console.log(e);
            res.status(400);
            res.send();
        }
    });

module.exports = router;
