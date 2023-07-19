import express from 'express';
export const viewsRouter = express.Router();

viewsRouter.get('/', async (req, res) => {
  res.render('home');
});

viewsRouter.get('/login', async (req, res) => {
  res.render('login-github');
});

viewsRouter.get('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render('error', { error: 'no se pudo cerrar su session' });
    }
    //return res.redirect('/login');
    return res.redirect('/api/auth/login');
  });
});
