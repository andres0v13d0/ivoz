import { Model } from 'mongoose';
import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async findId(email: string): Promise<string | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user?._id?.toString() ?? undefined;
  }
  
  async findUserByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ email }).select('email password').exec();
    return user ?? undefined;
  }
  
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findUserByEmail(createUserDto.email);

    if (existingUser) throw new ConflictException('This email is already in use.');

    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(userId: string): Promise<Partial<User> | undefined> {
    const user = await this.userModel.findById(userId).select('-password').exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(userId: string, updateUserDto: Partial<UpdateUserDto>, authenticatedUserId: string): Promise<User> {
    if (userId !== authenticatedUserId) throw new ForbiddenException('You are not authorized to update this profile');

    const allowedFields = ['firstName', 'lastName', 'avatarUrl', 'country', 'region', 'city', 'bio', 'specializations', 'rating'];
    const fieldsToUpdate = Object.keys(updateUserDto).filter(field => allowedFields.includes(field)).reduce((obj, field) => ({ ...obj, [field]: updateUserDto[field] }), {});

    if (updateUserDto.password) {
      fieldsToUpdate['password'] = updateUserDto.password;
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, fieldsToUpdate, { new: true }).select('-password').exec();
    if (!updatedUser) throw new NotFoundException(`User with ID ${userId} not found`);
    return updatedUser;
  }

  async findAllTalents(filters: { country?: string; region?: string; city?: string; specializations?: string[] }): Promise<User[]> {
    const query = this.userModel.find({ role: 'talent' });

    if (filters.country) query.where('country').equals(filters.country);
    if (filters.region) query.where('region').equals(filters.region);
    if (filters.city) query.where('city').equals(filters.city);
    if (filters.specializations) query.where('specializations').in(filters.specializations);

    return query.exec();
  }

  async findOne(email: string): Promise<UserDocument | undefined> {
    const id = await this.findId(email);
    if (!id) throw new NotFoundException('This email was not found');

    const user = await this.userModel.findById(id).exec();
    return user ?? undefined;
  }
}