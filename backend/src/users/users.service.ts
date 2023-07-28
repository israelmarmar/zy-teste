import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { LoginUserDto } from './dto/login-user.dto';

const prisma = new PrismaClient();
const salt = parseInt(process.env.AUTH_SALT);

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await bcrypt.hash(createUserDto.password, salt);

      const data = await prisma.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          password: passwordHash,
        },
      });
      return data;
    } catch (e) {
      throw new HttpException('Usuário já existente', HttpStatus.CONFLICT);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const user = await prisma.user.findFirst({
        where: { email: loginUserDto.email },
      });
      if (!user) {
        throw new HttpException(
          'Credenciais incorretas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Verificar a senha
      const passwordMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );
      if (!passwordMatch) {
        throw new HttpException(
          'Credenciais incorretas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Gerar o token de autenticação (JWT)
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token };
    } catch (e) {
      throw e;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
