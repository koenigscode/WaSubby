const router = require("express").Router();
const Users = require("../../schemas/users.js");
const passport = require("passport");
const { assertAdminOrSelf } = require("../../services/route-guards");

/**
 * Get /v2/users/{id}
 * @summary Returns user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 404 - user id not found
 */
router.get("/:id",
    passport.authenticate("jwt", { session: false }),
    assertAdminOrSelf,
    async (req, res) => {
        const user = await Users.findOne({ _id: req.params.id }).select(
            "-__v -password"
        );
        const _links = {
            "self": {
                href: `/v1/users/${user._id}`,
                method: "GET"
            },
            "all-users": {
                href: "/v1/users",
                method: "GET"
            },
            "delete-account": {
                href: `/v1/users/${user._id}`,
                method: "DELETE"
            },
            "udpate": {
                href: `/v1/users/${user._id}`,
                method: "UPDATE"
            },
            "patch": {
                href: `/v1/users/${user._id}`,
                method: "PATCH"
            },
            "login": {
                href: "/v1/users/login",
                method: "POST"
            },
            "signup": {
                href: "/v1/users",
                method: "POST"
            }
        };
        return res.send({ ...user.toObject(), _links });
    });

module.exports = router;