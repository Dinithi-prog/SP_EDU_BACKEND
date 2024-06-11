import {CanActivate, ExecutionContext, Injectable, UnauthorizedException, UsePipes} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from '@nestjs/config';
import {DatabaseRepository} from '@shared/repositories/database.repository';
import {SchemaConstants} from '@core/constants/schema-constants';

interface JWTPayload {
  userId: string;
  userName: string;
  iat: number;
  exp: number;
}

/**
 * A custom authentication guard for protecting routes that require authentication.
 * It verifies the presence and validity of a JSON Web Token (JWT) passed in the request's headers.
 * If the JWT is valid and the associated user (admin or client) exists, access is granted.
 * If the endpoint is marked as public, authentication is skipped.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly databaseRepository: DatabaseRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true; // Skip authentication for public endpoints
    }

    const request = context.switchToHttp().getRequest();
    const token = request?.headers['x-access-token']?.split('Bearer ')[1];

    try {
      const jwtSecret = this.configService.get('JWT_SECRET');
      const payload = (await jwt.verify(token, jwtSecret)) as JWTPayload;

      const userPromise = this.databaseRepository.selectWithAndOne(SchemaConstants.USER, {
        userId: payload.userId,
      });

      if (!userPromise) {
        return false;
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
