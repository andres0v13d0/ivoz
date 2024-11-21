import { Controller, Get, Post, Body, Param, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any
  ) {
    const authenticatedUserId = req.user['userId'];
    return this.usersService.update(id, updateUserDto, authenticatedUserId);
  }

  @Get('talents')
  async findAllTalents(@Body() filters: { country?: string; region?: string; city?: string; specializations?: string[] }) {
    return this.usersService.findAllTalents(filters);
  }
}
