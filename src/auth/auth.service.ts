import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SignUpInput } from './dto/sign-up.input';
import { UserInputError } from 'apollo-server-express';
import { SignInInput } from './dto/sign-in.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async signUp(signUpInput: SignUpInput) {
        try {
            const customer = await this.prisma.customer.create({ data: signUpInput })
            return customer
        } catch (err) {
            if (err.code === 'P2002') {
                throw new UserInputError(`Customer with email '${signUpInput.email}' already exists`)
            }
            throw new UserInputError('Customer not created')
        }
    }

    async signIn(signInInput: SignInInput) {
        const customer = await this.prisma.customer.findUnique({
            where: { email: signInInput.email }
        })
        if (!customer) throw new UserInputError(`Customer with email '${signInInput.email}' doesn't exist`)
        if (signInInput.password !== customer.password) throw new UserInputError(`Password doesn't match`)

        const payload = { sub: customer.id, username: customer.email };
        return {
            token: await this.jwtService.signAsync(payload),
        }
    }
}