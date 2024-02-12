import configs from 'configs';
import { userService } from 'modules/user';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export default function google() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: configs.google.clientId,
        clientSecret: configs.google.clientSecret,
        callbackURL: `${configs.url}/v1/auth/google/callback`
      },
      async function (_accessToken, _refreshToken, profile, done) {
        const user = await userService.findOrCreate({
          email: profile?.emails?.[0]?.value || '',
          first_name: profile.name?.givenName || '',
          last_name: profile.name?.familyName || ''
        });

        return done(null, user);
      }
    )
  );
}
