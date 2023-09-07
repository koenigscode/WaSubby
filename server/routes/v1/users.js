const router = require("express").Router();

router.get("/", function (req, res) {
    res.status(501).send("TODO:");
});

router.get("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

router.post("/login", function (req, res) {
    res.status(501).send("TODO:");
});

router.post("/register", function (req, res) {
    res.status(501).send("TODO:");
});

router.post("/logout", function (req, res) {
    res.status(501).send("TODO:");
});

router.patch("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

router.put("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

router.delete("/:id", function (req, res) {
    res.status(501).send("TODO:");
});

module.exports = router;
