const router = require("express").Router();
const Media = require("../../schemas/medias.js");
const path = require("path");
const Subtitle = require("../../schemas/subtitles.js");
const Language = require("../../schemas/languages.js");
const {assertAdmin} = require("../../services/route-guards");
const WhisperJob = require("../../services/WhisperJob.js");
const Users = require("../../schemas/users.js");
const fs = require("fs").promises;

router.get("/:fileHash", async (req, res) => {
    const media = await Media.findOne({fileHash: req.params.fileHash});
    return res.send(media);
});

/**
 * Get /v1/medias/{mediaId}/subtitles
 * @summary Returns subtitles of a specific media by id of that media
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - Not authorized
 */
router.get("/:fileHash/subtitles", async (req, res) => {
    const media = await Media.findOne({fileHash: req.params.fileHash}).populate("subtitles");
    if (media === null) {
        res.status(404);
        return res.send({ message: "Media with fileHash " + req.params.fileHash + " does not exist" });
    }

    if (media.subtitles !== null) {
        const result=[];
        for (let subtitle of media.subtitles){
            await subtitle.populate("language");
            const filePath = subtitle.filePath;
            await result.push({path: filePath, language: {name: subtitle.language.name, code: subtitle.language.code}});
            
        }
        return res.send(result);
    }
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
router.get("/:mediaId/subtitles/:subtitlesId", async (req, res) => {
    const media = await Media.findById(req.params.mediaId);
    if (media==null){
        res.status(404);
        return res.send({error: "Media with ID " + req.params.mediaId + " does not exist"});
    }
    const subtitle = await Subtitle.findById(req.params.subtitlesId);
    if (subtitle==null){
        res.status(404);
        return res.send({error: "Subtitles with ID " + req.params.subtitlesId + " does not exist"});
    }
    return res.send(subtitle);
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
router.post("/", async (req, res) => {
    if (!req.files || !req.files.media) {
        return res.status(400).json({message: "No file uploaded"});
    }

    const media = req.files.media;

    if(await Media.exists({fileHash: media.md5})) {
        return res.send(await Media.findOne({fileHash: media.md5}).lean());
    }

    let fileType = media.name.split(".");
    if (fileType.length < 2)
        return res.status(400).json({message: "File doesn't have a file extension"});

    fileType = fileType[fileType.length - 1];

    const fileName = `${media.md5}.${fileType}`;

    const filePath = path.join(
        "__dirname",
        "..",
        "/tmp",
        "/uploaded",
        fileName,
    );
    

    media.mv(filePath, (err) => {
        if (err) {
            return res.status(500).json({message: err});
        }
        
        const job = new WhisperJob(filePath, media.md5, async function() {
            const newMedia = new Media({fileHash: media.md5, processing: true});
            await newMedia.save();
            return res.status(201).send(newMedia);
        });
        job.execute().then(async (subs) => {
            console.log(`Subtitle generation for ${media.md5} done`);
            const newMedia = await Media.findOne({fileHash: media.md5});

            await fs.unlink(filePath);

            for (const sub of subs){
                const language = await Language.findOne({name: sub.language});
                const newSubtitles = new Subtitle({filePath: sub.path, language: language._id});
                await newSubtitles.save();
                await newMedia.subtitles.push(newSubtitles);
            }
            newMedia.processing = false;
            await newMedia.save();
            console.log("saved media " + media.md5);
            const user = await Users.findOne({_id: req.user._id});
            await user.uploadedMedias.push(newMedia);
            await user.save();

        }).catch((err) => {
            console.log(err);
            res.status(400);
            return res.send({message: "Can't process file"});
        });
    });
});

/**
 * Post /v1/medias/{mediaId}/subtitles
 * @summary Adds subtitles to media (not generated, but instead user-uploaded)
 * @tags medias
 * @param {File} subtitles.request.body.required - subtitles file in vtt format
 * @return {object} 201 - Success response
 * @return {object} 400 - File not in vtt format
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - Not authorized
 */
router.post("/:fileHash/subtitles",  async function (req, res) {
    if (!req.files || !req.files.subtitles) {
        return res.status(400).json({message: "No file uploaded"});
    }
    
    const media = await Media.findOne({fileHash: req.params.fileHash});
    if (media === null) {
        res.status(404);
        return res.send({ message: "Media with hash " + req.params.id + " does not exist" });
    }

    const language = await Language.findOne({code: req.body.languageCode});
    if (language === null) {
        res.status(404);
        return res.send({ message: "Language with code " + req.body.languageCode + " does not exist" });
    }

    const subtitles = req.files.subtitles;

    if (subtitles.mimetype !== "text/vtt") {
        return res.status(400).json({message: "File not in vtt format"});
    }

    const filePath = path.join(
        "__dirname",
        "..",
        "/data",
        `/${req.params.fileHash}`,
        `/${req.body.languageName}.vtt`
    );
    console.log(path.resolve(filePath));

    subtitles.mv(filePath, async (err) => {
        if (err) {
            return res.status(500).json({message: err});
        }

        const newSubtitles = new Subtitle({filePath: filePath, language: language._id});
        await newSubtitles.save();
        await media.subtitles.push(newSubtitles);
        await media.save();
        const result = await Subtitle.findById(newSubtitles._id).populate("language").select("-__v");
        return res.status(201).send(result.toObject());
    });
});

/**
 * Delete /v1/medias
 * @summary Deletes all medias
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 401 - not authorized
 */
router.delete("/", assertAdmin, async (req, res) => {
    try {
        const deletedMedias = await Media.find({}).lean();
        const result = await Media.deleteMany({});
        const deletedCount = result.deletedCount;

        if (deletedCount > 0) {
            res.status(200).json(deletedMedias);
        } else {
            res.status(200).json({ message: "No medias to delete" });
        }
    } catch (err) {
        console.error(err);
        res.status(401);
    }
});

/**
 * Delete /v1/medias/{fileHash}
 * @summary Deletes media by id
 * @tags medias
 * @return {object} 200 - Success response
 * @return {object} 404 - mediaId not found
 * @return {object} 401 - not authorized
 */
router.delete("/:fileHash", async (req, res) => {
    //it deletes by id, but we want to delete by hash? or both?
    const media = await Media.findOne({fileHash: req.params.fileHash});
    Media.deleteOne({fileHash: req.params.fileHash});

    if (Media === null) {
        res.status(404);
        res.send({ message: "Media with ID " + req.params.id + " does not exist" });
    }

    res.send(media);
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
router.delete("/:mediaId/subtitles/:subtitlesId", async (req, res) => {
    // TODO: only allow if user owns media or is admin
    const media = await Media.findById(req.params.mediaId);
    if (media==null){
        res.status(404);
        return res.send({message: "Media with ID " + req.params.mediaId + " does not exist"});
    }
    const subtitle = await Subtitle.findById(req.params.subtitlesId);
    if (subtitle==null){
        res.status(404);
        return res.send({message: "Subtitles with ID " + req.params.subtitlesId + " do not exist"});
    }
    if (subtitle.media!=req.params.mediaId){
        res.status(400);
        return res.send("Subtitles with ID " + req.params.subtitlesId + " do not belong to the media with ID " + req.params.mediaId);
    }
    Subtitle.findByIdAndDelete(req.params.subtitlesId);
    return res.send(subtitle.lean());
});

module.exports = router;
