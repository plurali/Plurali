import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { ApiDataResponse } from '@app/v2/types/response';
import { BaseController } from '../BaseController';
import { AuthGuard } from '@app/v2/context/auth/AuthGuard';
import { CurrentUser } from '@app/v2/context/auth/CurrentUser';
import { NotificationService } from '@domain/notification/NotificationService';
import { NotificationDto } from '@app/v2/dto/notification/NotificationDto';

@Controller({
  path: '/notification',
  version: '2',
})
@ApiTags('Notification')
@ApiSecurity('bearer')
@ApiExtraModels(NotificationDto)
export class NotificationController extends BaseController {
  constructor(
    private readonly notifications: NotificationService
  ) {
    super();
  }

  @UseGuards(AuthGuard)
  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [NotificationDto]))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async list(@CurrentUser() user: User): Promise<ApiDataResponse<NotificationDto[]>> {
    const notifications = await this.notifications.getNotificationsAndClear(user);

    return this.data(notifications.map(NotificationDto.from));
  }

}
