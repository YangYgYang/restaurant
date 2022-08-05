//此檔會export一個叫authenticator的函式
module.exports = {
    authenticator: (req, res, next) => {
        console.log(req)
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/users/login')
    }
}