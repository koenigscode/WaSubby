const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Users = require("./schemas/users");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const secret = process.env.JWT_SECRET || "TESTING";
const bcrypt = require("bcrypt");

passport.use("signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, 
async (email, password, next) => {
    try {
        const hash = await bcrypt.hash(password, 10);
        let user = await Users.create({ email, password: hash });
        user = await Users.findById(user._id).select("-__v -password").lean();
        return next(null, user);
    } catch (error) {
        let err = Error(error);

        if(error.code === 11000) {
            err = Error("User with this E-Mail already exists");
        }
        else if(error.errors && error.errors.email) {
            err = Error(error.errors.email.message);
        }

        err.status = 400;
        next(err);
    }
}
));

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, next) => {
            try {
                let user = await Users.findOne({ email });

                if (!user) {
                    return next(null, false, { message: "User not found" });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return next(null, false, { message: "Wrong Password" });
                }

                return next(null, user, { message: "Logged in Successfully" });
            } catch (error) {
                return next(error);
            }
        },
    ),
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: secret,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        },
        async (token, done) => {
            try {
                // The token might be valid, but the user might not exist anymore
                // Therefore, we have to check that the user is actually in the DB
                const user = await Users.findOne({ _id: token.user._id });     
                if(user === null) {
                    const err = Error("Invalid token, user does not exist");
                    err.status = 401;
                    return done(err);
                }

                return done(null, token.user);

            } catch (error) {
                done(error);
            }
        },
    ),
);
