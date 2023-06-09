import 'dotenv/config'
import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import userModel from '../api/users/users.model.js';

const initializePassport = () => {

    const githubData = {
        clientID: GIT_CLIENT_ID,
        clientSecret: GIT_CLIENT_SECRET,
        callbackUrl: GIT_CALLBACK_URL
    };

    const verifyAuthGithub = async (accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne({userName: profile._json.email});
            if(!user) {
                done(null, false);
            } else {
                done(null, user);
            }
        } catch (err) {
            return done(err.message);
        }
    };

    passport.use('github', new GitHubStrategy(githubData, verifyAuthGithub));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializePassport;