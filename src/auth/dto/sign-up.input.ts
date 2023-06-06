import { Field, InputType } from "@nestjs/graphql";
import { IsStrongPassword } from "class-validator";
import { SignInInput } from "./sign-in.input";

@InputType()
export class SignUpInput extends SignInInput {
    @IsStrongPassword()
    @Field(() => String)
    password: string
}