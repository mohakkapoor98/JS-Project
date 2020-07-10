const { new: _new, index, show, create, edit, update, delete: _delete } = require('../controllers/GymController');

function auth(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('danger', 'You need to login first.');
        return res.redirect('/login');
    }
    next();
}

module.exports = router => {
    router.get('/gym', index);
    router.get('/gym/new', auth, _new); // authenticated
    router.post('/gym', auth, create);  // authenticated
    router.post('/gym/update', auth, update);  // authenticated
    router.post('/gym/delete', auth, _delete);  // authenticated
    router.get('/gym/:id/edit', auth, edit);  // authenticated
    router.get('/gym/:id', show); // public
};