import * as bcrypt from 'bcrypt'
import { prisma } from "../infra/prisma";
import { AuthRegisterRequestDTO } from "./dtos/auth-register-request.dto";
import { AppError } from '../errors';

export const emailExists = async (email: string) => {
  if (await prisma.user.count({ where: { email } })) {
    throw new AppError('O e-mail já está cadastrado');
  }
};

export const register = async (data: AuthRegisterRequestDTO) => { 
  const { email, name, password, role } = data.getAll();

  await emailExists(email);

  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

  const user = await prisma.user.create({data: {
    email,
    name,
    password: passwordHash,
    role
  }});

  return { email: user.email };
};