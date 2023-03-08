import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ValidatePassword } from '../utils/decorators/password.decorator';

export class UserCreateDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @ValidatePassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  @ValidatePassword()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsEmail()
  @IsOptional()
  confirmEmail: string;
}
