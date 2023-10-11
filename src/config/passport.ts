import { Strategy as LocalStrategy } from 'passport-local'
import passport from "passport";
import { authUser } from "../infra/passport";
import { prisma } from '../infra/prisma';

export const passportSetup = () => {
  passport.use(new LocalStrategy (authUser));

  passport.serializeUser((user, done) => {  
    return done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await prisma.user.findUnique({ where: { id: String(id) } })
    if(!user) return done(new Error('User not found'))

    done (null, {role: user.role, id: user.id} )      
  }) 
}