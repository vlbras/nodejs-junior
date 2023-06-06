import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomerInput } from './dto/customer.input';
import { updateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  // find Customer by id or email
  @Query(() => Customer)
  async customer(@Args('identifier') identifier: string): Promise<Customer>{
    return this.customerService.findOne(identifier)
  }

  // update Customer by id or email
  @Mutation(() => Customer)
  async updateCustomer(
    @Args('identifier') identifier: string,
    @Args('updateCustomerInput') updateCustomerInput: updateCustomerInput
    ): Promise<Customer> {
    return this.customerService.update(identifier, updateCustomerInput)
  }

  // delete Customer by id or email
  @Mutation(() => Customer)
  async deleteCustomer(@Args('identifier') identifier: string): Promise<Customer> {
    return this.customerService.delete(identifier)
  }
}