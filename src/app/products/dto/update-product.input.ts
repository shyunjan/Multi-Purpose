import { PartialType } from '@nestjs/mapped-types';
import Product from '../entities';

export class UpdateProduct extends PartialType(Product) {}
