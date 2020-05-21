const formidable = require('formidable');
const passport = require('passport');
const pdfParser = require('./util/pdf-parsing');
const connectEnsureLogin = require('connect-ensure-login');

const User = require('./models/user');
const Booklet = require('./models/booklet');

const routes = (app) => {
/* register */
app.post('/api/v1/register', function(req, res) { 
  console.log('register api called')
  Users=new User({email: req.body.email, username : req.body.username}); 
  console.log(req.body);
  User.register(Users, req.body.password, function(err, user) { 
    if (err) { 
      console.log('account could not be saved');
      res.json({success: false});
    } else {
      console.log('account saved');
      res.json({
        success: true, 
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    }
  })
});

/* login */
app.post('/api/v1/login', function(req, res) {
  console.log('login api called')
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      res.json({success: false});
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log(user);
      res.json({
        success: true, 
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        }
      });
    });
  })(req, res);
});

/* logout */
app.get('/api/v1/logout', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.sendStatus(201);
});

/* GET logged in user */
app.get('/api/v1/user',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.send({user: req.user})
);

  /* GET a Booklet by Id */
app.get('/api/v1/:id', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log('get booklet ' + req.params.id)
  //dao.getBookletById(req.params.id, res);
  const id = ObjectId("5ebebf4ace834544f21faf8d");
  res.send(Booklet.findById(id));
});

/* GET Booklets by User Id */
app.get('api/v1/all/:userId', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log('get booklets by user ' + req.params.userId)
  //dao.getBookletsByUserId(req.params.userId, res);
  res.send(Booklet.find({userId: req.params.userId}));
});

/* GET Likes by User Id */
app.get('/api/v1/likes/:userId', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log('get likes for user ' + req.params.userId)
  res.send(Booklet.find({likes: {$in: [req.params.userId]} }))
  // dao.getLikesByUserId(req.params.userId, res);
});

/* PUT update user info */
app.put('/api/v1/user', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  console.log('update user info');
  User.replaceOne({_id: body._id}, body);
});

/* POST a Booklet */
app.post('/api/v1/save', (req, res) => {
  console.log('post booklet')
  const booklet = new Booklet(req.body);
  booklet.save((err, booklet) => {
    if (err) {
      return console.error(err);
    }
    console.log('booklet saved');
  })
  //dao.saveBooklet(req.body, req.params.userId, res);
});

/* POST pdf to be uploaded */
app.post('/api/v1/pdf', (req, res) => {
  console.log('upload booklet as pdf')
  new formidable.IncomingForm().parse(req, (err, fields, files) => {
    if (err) {
      console.error('Error', err)
      throw err
    }
    // save a pdf 
    pdfParser.getBookletFromPDF(files.pdf, fields.userId).then( data => {
      const booklet = new Booklet(data);
      booklet.save((err, booklet) => {
        if (err) {
          return console.error(err);
        }
        console.log('booklet saved from pdf');
      });
    }).catch(err => {
      console.log(err);
    })
      // const booklet = new Booklet();
      // booklet.save((err, booklet) => {
      //   if (err) {
      //     return console.error(err);
      //   }
      //   console.log('booklet saved from pdf');
      // })
    // console.log('Files', files)
    // for (const pdf of Object.entries(files)) {
    //   console.log('this is a saving of a pdf')
    //   // save a pdf 
    //   const booklet = new Booklet(pdfParser.getBookletFromPDF(pdf, userId));
    //   booklet.save((err, booklet) => {
    //     if (err) {
    //       return console.error(err);
    //     }
    //     console.log('booklet saved from pdf');
    //   })
    //   //dao.savePdfAsBooklet(pdf, req.params.userId, res);    
    // }
  })
});
}
module.exports = routes;