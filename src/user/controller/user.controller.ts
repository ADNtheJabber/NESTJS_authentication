import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @Post('login')
    login(@Body()user: User): Observable<User | Object>{
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return {
                    access_token: jwt
                }
            })
        )
    }

    @Post()
    create(@Body()user: User): Observable<User | Object>{
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message}))
        );
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll(): Observable<User[]>{
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param()params): Observable<User>{
        return this.userService.findOne(params.id);
    }

    @Put(':id')
    update(@Param('id')id: string, @Body() user: User): Observable<User>{
        return this.userService.update(Number(id), user);
    }
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User ): Observable<User>{
        return this.userService.updateRoleOfUser(Number(id), user);
    }

    @Get(':id')
    delete(@Param('id')id: string): Observable<User>{
        return this.userService.delete(Number(id));
    }
}
