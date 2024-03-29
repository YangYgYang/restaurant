//此檔會export一個叫authenticator的函式
module.exports = {
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', '請先登入才能使用！')
        res.redirect('/users/login')
    }
}