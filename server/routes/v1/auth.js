const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../../schemas/users");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const secret = process.env.JWT_SECRET || "TESTING";


router.post(
    "/signup",
    passport.authenticate("signup", { session: false }),
    async (req, res, next) => {
        res.json({
            message: "Signup successful",
            user: req.user
        });
    }
);

router.post(
    "/login",
    async (req, res, next) => {
        passport.authenticate(
            "login",
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error("An error occurred.");
  
                        return next(error);
                    }
  
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);
  
                            const body = { _id: user._id, email: user.email };
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

module.exports = router;