import configs from 'configs';
import { User } from 'modules/user';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function google() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: configs.google.clientId,
        clientSecret: configs.google.clientSecret,
        callbackURL: 'http://localhost:3000/v1/auth/google/callback'
      },
      async function (_accessToken, _refreshToken, profile, done) {
        const user = await User.findOrCreate({
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          email: profile?.emails?.[0]?.value || ''
        });

        return done(null, user);
      }
    )
  );
}
