import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomerInput } from './dto/customer.input';
import { UserInputError } from 'apollo-server-express';
import { Customer } from 'src/lib/entities/customer.entity';
import { updateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  // find Customer by id or email
  async findOne(identifier: string): Promise<Customer> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier },
        ]
      }
    })
    if (!customer) {
      throw new UserInputError(`Customer with identifier '${identifier}' doesn't exist`)
    }

    return customer
  }

  // update Customer by id or email
  async update(identifier: string, updateCustomerInput: updateCustomerInput): Promise<Customer> {
    const { id, email } = await this.findOne(identifier)
    // check if updateCustomerInput is empty
    if (Object.keys(updateCustomerInput).length === 0) {
      throw new UserInputError(`No data provided to update Customer with identifier '${identifier}'`)
    }
    // check if email is unique
    if (updateCustomerInput.email && updateCustomerInput.email !== email) {
      await this.isEmailUnique(updateCustomerInput.email)
    }
    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerInput
    })
  }

  // delete Customer by id or email
  async delete(identifier: string): Promise<Customer> {
    const { id } = await this.findOne(identifier)
    return this.prisma.customer.delete({
      where: { id }
    })
  }

  // check if email is unique
  private async isEmailUnique(email: string): Promise<boolean> {
    const customer = await this.prisma.customer.findFirst({
      where: { email }
    })
    if (!customer) return true

    throw new UserInputError(`Customer with email '${email}' already exists`)
  }
}