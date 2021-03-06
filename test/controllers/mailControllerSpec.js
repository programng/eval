var request      = require('supertest'),
    express      = require('express'),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose'),
    TempUser = require('../../server/user/tempUserModel'),
    mailController = require('../../server/mail/mailController');

var config = require('config');
// mongoose.connect(config.get('mongo'));

var app = express();
app.use(bodyParser.json());

app.post('/signup', mailController.sendConfirmationEmail, function(req, res) {
  res.send('success signup');
});

var agent;
describe('Mail Controller Spec Specs', function() {

  describe('Signup', function () {
    it('should send email', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'test', business_name: "Starbucks", email: 'kirby8u@gmail.com', password: 'hackreactor'})
        .expect(200, done);
    });

    it('should return error if attempting to signup with a used email', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'test', business_name: 'Starbucks', email: 'kirby8u@hotmail.com', password: 'hackreactor'})
        .expect(401, done);
    });
  });
});