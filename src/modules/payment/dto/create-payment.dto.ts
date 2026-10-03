import { IsNotEmpty, IsNumber, IsEmail, IsString, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  amount: number;

  @IsNotEmpty()
  @IsEmail()
  payerEmail: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
