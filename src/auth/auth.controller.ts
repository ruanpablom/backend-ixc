import { Request, Response } from "express";
import { AuthRegisterRequestDTO } from "./dtos/auth-register-request.dto";
import { register as registerService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const data = new AuthRegisterRequestDTO(req.body);

  const userCreationResult = await registerService(data);

  res.json(userCreationResult);
}

export const login = async (req: Request, res: Response) => {
  res.json({ message: 'login' });
}