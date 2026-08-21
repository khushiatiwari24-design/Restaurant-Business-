import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { SafeUser, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async adminLogin(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordOk = await bcrypt.compare(password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const safeUser = this.usersService.toSafeUser(user);
    const accessToken = await this.signToken(safeUser);

    return {
      accessToken,
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        role: safeUser.role,
      },
    };
  }

  async getMe(user: SafeUser) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  logout() {
    // Stateless JWT: client discards the token. Refresh-token revocation can be added later.
    return { success: true };
  }

  private async signToken(user: SafeUser) {
    const expiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '12h';
    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: expiresIn as `${number}h` | `${number}d` | number,
      },
    );
  }
}
