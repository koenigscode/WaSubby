const router = require("express").Router();

/**
 * Get /v1/users
 * @summary Returns all users
 * @tags users
 * @return {object} 200 - Success response
 */
router.get("/", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Get /v1/users/{id}
 * @summary Returns user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 404 - user id not found
 */
router.get("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Post /v1/users/login
 * @summary Logs in a user
 * @tags users
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post("/login", function (req, res) {
    res.status(501).send("TODO:");
});
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

/**
 * Post /v1/users/logout
 * @summary Logs out a user
 * @tags users
 * @return {object} 201 - Success response
 * @return {object} 400 - Bad request response
 */
router.post("/logout", function (req, res) {
    res.status(501).send("TODO:");
});


/**
 * Patch /v1/users/{id}
 * @summary Partially update a user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - user id not found
 */
router.patch("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Put /v1/users/{id}
 * @summary Updates a user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - user id not found
 */
router.put("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

/**
 * Delete /v1/users/{id}
 * @summary Deletes a user by id
 * @tags users
 * @return {object} 200 - Success response
 * @return {object} 400 - Bad request response
 * @return {object} 404 - user id not found
 */
router.delete("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
