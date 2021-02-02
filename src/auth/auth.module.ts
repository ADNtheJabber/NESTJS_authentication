import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from './constants';
import { JwtAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';

@Module({
    imports:[
        forwardRef(() => UserModule), 
        JwtModule.registerAsync({
            imports:[
                ConfigModule
            ],
            inject:[
                ConfigService
            ],
            useFactory: async () => ({
                secret: jwtConstants.secret,
                signOptions: {
                    expiresIn: '100s'
                }
            })
        })
    ],
    providers: [AuthService, JwtAuthGuard, RolesGuard, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
