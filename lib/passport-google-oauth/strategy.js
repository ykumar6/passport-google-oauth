/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var https = require("https");


/**
 * `Strategy` constructor.
 *
 * The Facebook authentication strategy authenticates requests by delegating to
 * Facebook using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Facebook application's App ID
 *   - `clientSecret`  your Facebook application's App Secret
 *   - `callbackURL`   URL to which Facebook will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new FacebookStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/facebook/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'http://accounts.google.com/o/oauth2/auth';
  options.tokenURL = options.tokenURL || 'https://accounts.google.com/o/oauth2/token';
  options.scopeSeparator = options.scopeSeparator || ' ';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'google-oauth';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Facebook.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `facebook`
 *   - `id`               the user's Facebook ID
 *   - `username`         the user's Facebook username
 *   - `displayName`      the user's full name
 *   - `name.familyName`  the user's last name
 *   - `name.givenName`   the user's first name
 *   - `name.middleName`  the user's middle name
 *   - `gender`           the user's gender: `male` or `female`
 *   - `profileUrl`       the URL of the profile for the user on Facebook
 *   - `emails`           the proxied or contact email address granted by the user
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
   console.log("getting profile " + accessToken);

        https.get({ host: 'www.googleapis.com', path: '/oauth2/v1/userinfo?access_token=' + accessToken }, function(res) {
            res.on('data', function(chunk) {
                var o = JSON.parse(chunk.toString());
		console.log(chunk.toString());
		var profile = { provider: 'google' };
      		profile.id = o.id;
     	 	profile.username = o.username || "";
      		profile.displayName = o.name;
      		profile.gender = o.gender;
      		profile.profileUrl = o.link;
      		profile.emails = [{value: o.email}];

      		done(null, profile);
          });
          
        }).on('error', function(e) {
            done(true, "Could not get email address");
        });

/*
   this._oauth2.getProtectedResource('https://www.googleapis.com/oauth2/v1/userinfo/', accessToken, function (err, body, res) {
     console.log("usr");  
     console.log(err);    

    if (err) { return done(err); }
    
    try {
      o = JSON.parse(body);
      
      var profile = { provider: 'google' };
      profile.id = o.id;
      profile.username = o.username;
      profile.displayName = o.name;
      profile.name = { familyName: o.last_name,
                       givenName: o.first_name,
                       middleName: o.middle_name };
      profile.gender = o.gender;
      profile.profileUrl = o.link;
      profile.emails = [{ value: o.email }];
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
*/
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
