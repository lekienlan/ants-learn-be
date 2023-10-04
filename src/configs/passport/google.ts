import { User } from 'modules/user';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function google() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:3000/v1/auth/google/callback'
      },
      async function (_accessToken, _refreshToken, profile, done) {
        await User.findOrCreate({
          googleId: profile.id,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          email: profile?.emails?.[0]?.value || ''
        });

        return done(null, profile);
      }
    )
  );
}

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
