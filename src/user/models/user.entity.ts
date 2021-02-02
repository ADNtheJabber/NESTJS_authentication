import { type } from "os";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.interface";


@Entity()
export class UserEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique : true })
    email:string;

    @Column()
    password:string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.User
    })
    role: UserRole;

    @Column()
    isActive:boolean;

    @BeforeInsert()
    emailToLowerCase(){
        this.email = this.email.toLowerCase();
    }
}