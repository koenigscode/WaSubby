const router = require("express").Router();
const Users = require("@/schemas/users.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const secret = process.env.JWT_SECRET || "TESTING";
const { assertAdmin, assertAdminOrSelf } = require("@/services/route-guards");


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
        const users = await Users.find().select("-__v -password");
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
    assertAdminOrSelf,
    async (req, res) => {
        const user = await Users.findOne({ id: req.params._id }).select(
            "-__v -password"
        ).lean();
        res.send({...user});
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
                        return res.status(400).json({ message: "Invalid password or user not found" });
                    }

                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, email: user.email, admin: user.admin, theme: user.theme };
                            const token = jwt.sign({ user: body }, secret);

                            let reponseUser = { ...req.user.toObject() };
                            delete reponseUser.password;
                            delete reponseUser.__v;
                            return res.json({ token, user: reponseUser });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);

/**
 * Post /v1/users
 * @summary Registers a user
 * @tags users
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post(
    "/",
    passport.authenticate("signup", { session: false }),
    async (req, res, next) => {

        return res.status(201).json(
            req.user
        );
    }
);

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
    assertAdminOrSelf,
    async function (req, res) {

        try {
            const user = await Users.findById(req.params.id);
            if (user === null) {
                res.status(404);
                res.send({ message: "User with ID " + req.params.id + " does not exist" });
            }

            const oldUser = user.toObject();
            const newUserData = req.body;
            if(!oldUser.admin) {
                delete req.body.admin; // don't allow user to make himself admin
            }
            delete oldUser._id;
            delete newUserData._id;

            console.log(oldUser);
            console.log(newUserData);
            await Users.findByIdAndUpdate(req.params.id, { ...oldUser, ...newUserData});

            res.send(await Users.findById(req.params.id).select("-__v -password"));
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
            const user = await Users.findById(req.params.id);
            if (user === null) {
                res.status(404);
                res.send({ message: "User with ID " + req.params.id + " does not exist" });
            }
            const newUserData = req.body;
            const id = req.params._id;
            await Users.updateOne({ ...newUserData, id });
            res.send(await Users.findById(req.params.id).select("email admin theme"));
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
    assertAdminOrSelf,
    async (req, res) => {

        const user = await Users.findById(req.params.id);
        // await Users.deleteOne({ _id: req.params.id });
        user.deleteOne();

        // const user = await Users.findOneAndDelete({_id: req.params.id}).select(
        //     "-uploadedMedias -__v",
        // );

        if (user === null) {
            res.status(404);
            return res.send({ message: "User with ID " + req.params.id + " does not exist" });
        }

        return res.send(user);
    });



module.exports = router;
