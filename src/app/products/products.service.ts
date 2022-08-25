import { Injectable } from '@nestjs/common';
import { UpdateProduct } from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Product, { ProductDocument } from './entities';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private product: Model<ProductDocument>) {}

  async create(createProductDto: Product): Promise<ProductDocument> {
    const productDoc: ProductDocument = new this.product(createProductDto);
    return productDoc.save();
  }

  async findAll(ids: number[]): Promise<ProductDocument[] | null> {
    return this.product.find({ _id: { $in: ids } }).exec();
  }

  async findOne(id: number): Promise<ProductDocument | null> {
    return this.product.findById(id).exec();
  }

  async update(id: number, updateProductDto: UpdateProduct): Promise<ProductDocument | null> {
    return this.product.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  async remove(id: number): Promise<{ deletedCount: number }> {
    return this.product.deleteOne({ _id: id });
  }
}
