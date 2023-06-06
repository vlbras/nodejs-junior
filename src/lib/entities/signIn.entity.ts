import { Field, ObjectType } from "@nestjs/graphql";
import { Customer } from "./customer.entity";

@ObjectType()
export class SignIn {
  @Field(() => Customer)
  customer: Customer;
  
  @Field(() => String)
  token: string;
}