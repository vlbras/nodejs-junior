import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsStrongPassword } from "class-validator";

@InputType()
export class updateCustomerInput {
    @IsEmail()
    @Field(() => String)
    email: string

    @IsStrongPassword()
    @Field(() => String)
    password: string
}