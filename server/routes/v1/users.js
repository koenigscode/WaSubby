const router = require("express").Router();
const User = require("@/schemas/users.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secret = process.env.JWT_SECRET || "TESTING";
const assertAdmin = require("@/services/assert-admin");


/**
 * Get /v1/users
 * @summary Returns all users
 * @tags users
 * @return {object} 200 - Success response
 */
router.get("/",
    passport.authenticate("jwt", { session: false }),
    assertAdmin,
    async (req, res) => {
        // if(!req.user.admin)
        //     return res.status(403).send();

        console.log(req.user);
        const users = await User.find().select("email admin theme");
        return res.send(users);
    });

/**
 * Get /v1/users/{id}
 * @summary Returns user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 404 - user id not found
 */
router.get("/:id",
    passport.authenticate("jwt", { session: false }),
    assertAdmin,
    async (req, res) => {
        const user = await User.findOne({ id: req.params._id }).select(
            "email admin theme"
        );
        res.send(user);
    });

/**
 * Post /v1/users/login
 * @summary Logs in a user
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 */
router.post(
    "/login",
    async (req, res, next) => {
        passport.authenticate(
            "login",
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        return res.status(400).send("Invalid password or user not found");
                    }
  
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);
  
                            const body = { _id: user._id, email: user.email, admin: user.admin, theme: user.theme };
                            const token = jwt.sign({ user: body }, secret);
  
                            return res.json({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

//TODO: route name
/**
 * Post /v1/users/register
 * @summary Registers a user
 * @tags users
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post(
    "/register",
    passport.authenticate("register", { session: false }),
    async (req, res, next) => {

        res.json({
            message: "Signup successful",
            user: req.user
        });
    }
);

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
router.patch("/:id", passport.authenticate("jwt", { session: false }),
    assertAdmin, 
    async function (req, res) {
    
        try {
            const user = await User.findById(req.params.id);
            if (user === null) {
                res.status(404);
                res.send({ error: "User with ID " + req.params.id + " does not exist" });
            }

            const oldUser = user.toObject();
            const newUserData = req.body;
            const id = req.params._id;

            await User.updateOne({ ...oldUser, ...newUserData, id });
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
router.put("/:id", 
    passport.authenticate("jwt", { session: false }),
    assertAdmin,
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (user === null) {
                res.status(404);
                res.send({ error: "User with ID " + req.params.id + " does not exist" });
            }
            const newUserData = req.body;
            const id = req.params._id;
            await User.updateOne({ ...newUserData, id });
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
router.delete("/:id", 
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        
        // TODO: only admin can delete any user, other users only themselves
        if(!req.user.admin && req.user._id !== req.params.id)
            return res.status(403).send();

        let user = null;
        try {
            user = await User.findByIdAndDelete(req.params.id).select(
                "-uploadedMedias -__v",
            );
        } catch(err) {
            return res.status(404).send({message: `User with ID ${req.params.id} not found`});
        }
        console.log(user);

        if (user === null) {
            res.status(404);
            return res.send({ error: "User with ID " + req.params.id + " does not exist" });
        }

        res.send(user);
    });

module.exports = router;
