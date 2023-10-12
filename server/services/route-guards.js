const assertAdmin = (req, res, next) => {
    if(!req.user.admin)
        return res.status(403).send();
    next();
};

const assertAdminOrSelf = (req, res, next) => {
    if(req.user.admin || req.user._id == req.params.id)
        return next();
    return res.status(403).send();
};

module.exports = {assertAdmin, assertAdminOrSelf};