import passport from 'passport';
import catchAsync from 'utils/catchAsync';

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});

export const loginWithGoogle = catchAsync(
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
