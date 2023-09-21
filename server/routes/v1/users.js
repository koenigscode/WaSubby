const router = require("express").Router();
const User = require("../../schemas/users.js");

/**
 * Get /v1/users
 * @summary Returns all users
 * @tags users
 * @return {object} 200 - Success response
 */
router.get("/", async (req, res) => {
    const users = await User.find().select("email admin theme");
    res.send(users);
});

/**
 * Get /v1/users/{id}
 * @summary Returns user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 404 - user id not found
 */
router.get("/:id", async (req, res) => {
    const user = await User.findOne({ id: req.params._id }).select(
        "email admin theme"
    );
    res.send(user);
});

//TODO: route name
/**
 * Post /v1/users/login
 * @summary Logs in a user
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.post("/login", function (req, res) {
    res.status(501).send("TODO:");
});

//TODO: route name
/**
 * Post /v1/users/register
 * @summary Registers a user
 * @tags users
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post("/register", function (req, res) {
    res.status(501).send("TODO:");
});

// TODO: params
/**
 * Patch /v1/users/{id}
 * @summary Partially update a user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - user id not found
 * @return {object} 401 - not authorized
 */
router.patch("/:id", async function (req, res) {// TODO: only for admins
    try {
        const user = await User.findById(req.params.id);
        if (user === null) {
            res.status(404);
            res.send({ error: "User with ID " + req.params.id + " does not exist" });
        }

        const oldUser = user.toObject();
        const newUserData = req.body;
        const id = req.params._id;

        await User.updateOne({...oldUser, ...newUserData, id });
        res.send(await User.findById(req.params.id).select("email admin theme"));
    } catch (e) {
        console.log(e);
        res.status(400);
        res.send();
    }
});

// TODO: params
/**
 * Put /v1/users/{id}
 * @summary Updates a user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - user id not found
 */
router.put("/:id", async (req, res) => {
    // TODO: only for admins
    try {
        const user = await User.findById(req.params.id);
        if (user === null) {
            res.status(404);
            res.send({ error: "User with ID " + req.params.id + " does not exist" });
        }
        const newUserData = req.body;
        const id = req.params._id;
        await User.updateOne({...newUserData, id });
        res.send(await User.findById(req.params.id).select("email admin theme"));
    } catch (e) {
        console.log(e);
        res.status(400);
        res.send();
    }
});

/**
 * Delete /v1/users/{id}
 * @summary Deletes a user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 404 - user id not found
 * @return {object} 403 - no permission
 */
router.delete("/:id", async (req, res) => {
    // TODO: only admin can delete any user, other users only themselves
    const user = await User.findByIdAndDelete(req.params.id).select("-uploadedMedias -__v");
    console.log(user);

    if (user === null){
        res.status(404);
        res.send ({error: "User with ID " + req.params.id + " does not exist"});
    }
    
    res.send(user);
});

module.exports = router;
