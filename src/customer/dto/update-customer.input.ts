import { InputType, PartialType } from "@nestjs/graphql";
import { SignUpInput } from "src/auth/dto/sign-up.input";

@InputType()
export class updateCustomerInput extends PartialType(SignUpInput) {}