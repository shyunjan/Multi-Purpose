import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import Order from './entities';
import { CreateOrderInput, UpdateOrderInput } from './dto';
import Product from '../products/entities';
import { ProductsService } from 'src/app/products/products.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly productsService: ProductsService
  ) {}

  @Mutation(() => Order)
  async createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput): Promise<Order> {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.findOne(id);
  }

  @ResolveField('orderProducts', (returns) => [Product])
  async getOrderProducts(@Parent() order: Order): Promise<Product[]> {
    return (await this.productsService.findAll(order.orderProductIds)) ?? [];
  }

  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.update(updateOrderInput._id, updateOrderInput);
  }

  @Mutation(() => Order)
  removeOrder(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.remove(id);
  }
}
