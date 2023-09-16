const { default: mongoose } = require("mongoose");

const router = require("express").Router();
const Language = mongoose.model("Language",  require("../../schemas/languages.js"));


/**
 * Get /v1/languages
 * @summary Returns all languages
 * @tags languages
 * @param {string} filter.query - text to filter by
 * @param {string} sort.query - asc / desc
 * @return {object} 200 - Success response
 */
router.get("/", async (req, res) => {
    console.log("hi")
    const languages = await Language.find()
    res.send(languages)
});

/**
 * Get /v1/languages/{code}
 * @summary Returns a language by code
 * @tags languages
 * @return {object} 200 - Success response
 * @return {object} 404 - language code not found
 */
router.get("/:code", async (req, res) => {
    const language = await Language.findOne({code: req.params.code});
    res.send(language)
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
router.put("/:code", async (req, res) => {
    try {
        const language = await Language.findOne({code: req.params.code})

        if (req.body.name){
            language.name = req.body.name
        }

        await language.save();
        res.send(language)
    } catch{
        res.status(404);
        res.send({error: "Langauge with code " + req.params.code + " does not exist"})
    }
});

module.exports = router;
