import { Delete, Get, Param, Patch } from '@nestjs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientService } from 'src/usecases/client/client.service';
import { CreateClientDto, UpdateClientDto } from './dtos/client';
import { JwtAuthGuard } from './guards/auth.guard';
import { UserId } from './decorators/token.decorator';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { RoleEnum } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Roles(RoleEnum.USER)
  @Post('/create')
  create(@Body() userData: CreateClientDto, @UserId() userId: string) {
    const userDataWithId = {
      ...userData,
      userId,
    };
    return this.clientService.create(userDataWithId);
  }

  @Roles(RoleEnum.USER)
  @Get()
  getAll(@UserId() userId: string) {
    return this.clientService.getAll(userId);
  }

  @Roles(RoleEnum.USER)
  @Get(':id')
  getById(@UserId() userId: string, @Param('id') clientId: string) {
    return this.clientService.getById({ userId, clientId });
  }

  @Roles(RoleEnum.USER)
  @Patch(':id')
  update(
    @UserId() userId: string,
    @Param('id') clientId: string,
    @Body()
    userData: UpdateClientDto,
  ) {
    const userDataWithId = {
      ...userData,
      userId,
      id: clientId,
    };
    return this.clientService.update(userDataWithId);
  }

  @Roles(RoleEnum.USER)
  @Delete(':id')
  remove(@UserId() userId: string, @Param('id') clientId: string) {
    return this.clientService.delete({ userId, clientId });
  }
}
