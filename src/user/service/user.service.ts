import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators'
import { AuthService } from 'src/auth/services/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private authservice: AuthService
    ){}

    create(user: User): Observable<any>{

        return this.authservice.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();

                    newUser.email = user.email;
                    newUser.password = passwordHash;
                    newUser.role = user.role;
                    newUser.isActive = true;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {
                            password, ...result
                        } = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )

            }
            )
        )
    }

    findAll(): Observable<User[]>{
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {
                    delete v.password
                });
                return users;
            }
            )
        );
    }

    findOne(id: number): Observable<any>{
        return from(this.userRepository.findOne(id)).pipe(
            map((user: User) => {
                const {
                    password, ...result
                } = user;
                return result;
            }
            )
        );
    }

    update(id: number, user: User): Observable<any>{
        delete user.email;
        delete user.password;

        return from(this.userRepository.update(id, user));
    }

    updateRoleOfUser(id: number, user: User): Observable<User | any>{
        return from(this.userRepository.update(id, user));
    }

    delete(id: number): Observable<any>{
        return from(this.userRepository.delete(id));
    }

    findByEmail(email: string): Observable<User>{
        return from(this.userRepository.findOne({email}));
    }

    login(user: User): Observable<string>{
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authservice.generateJWT(user).pipe(
                        map((jwt: string) => jwt)
                    )
                } else {
                    return "Informations incorrectes !";                   
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User | any>{
        return this.findByEmail(email).pipe(
            switchMap((user: User) => this.authservice.comparePasswords(password, user.password).pipe(
                map((match: Boolean)=> {
                    if (match) {
                        const {
                            password, ...result
                        } = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )
    }
}
