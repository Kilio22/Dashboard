const passport = require('passport');
const User = require('../models/User');
const { JWT_PASSPORT_CONFIG } = require('../config/jwtConfig');
const JwtStrategy = require('passport-jwt').Strategy;

passport.use('office-jwt', new JwtStrategy(JWT_PASSPORT_CONFIG,
    async (token, done) => {
        try {
            let user = await User.findOne({ email: token.email, isMicrosoftAuthed: true });

            if (!user) {
                user = await User.create({
                    email: token.email,
                    displayName: token.name,
                    isMicrosoftAuthed: true
                });
            }
            return done(null, user);
        } catch (error) {
            done(error);
        }
    }
    )
);
