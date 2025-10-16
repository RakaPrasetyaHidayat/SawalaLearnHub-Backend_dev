import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseService } from '../../../infra/supabase/supabase.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly supabaseService: SupabaseService
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Use admin client to fetch user to avoid RLS issues during authentication
    const user = await this.supabaseService.findOne('users', payload.sub, true);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
