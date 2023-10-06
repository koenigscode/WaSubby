const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./schemas/users");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const secret = process.env.JWT_SECRET || "TESTING";

passport.use("signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, 
async (email, password, next) => {
    try {
        let user = await User.create({ email, password });
        user = await User.findById(user._id).select("-__v -password").lean();
        return next(null, user);
    } catch (error) {
        let err = Error();

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
                let user = await User.findOne({ email });

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
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        },
    ),
);
