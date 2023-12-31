import * as bcrypt from 'bcrypt'
import { IVerifyOptions } from "passport-local"
import { prisma } from "./prisma"

export const authUser = async (username: string, password: string, done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void) => {

  const user = await prisma.user.findUnique({ where: { email: username } })

  if(!user) return done(null, false)

  if(!(await bcrypt.compare(password, user!.password))) return done(null, false)

  
  let authenticated_user = { id: user!.id} 
  
  return done (null, authenticated_user ) 
}