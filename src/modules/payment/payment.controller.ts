import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-invoice')
  async createInvoice(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Post('xendit-webhook')
  @HttpCode(HttpStatus.OK)
  async handleXenditWebhook(
    @Headers('x-callback-token') callbackToken: string,
    @Body() payload: any
  ) {
    // Security check: Verify callback token
    const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;
    if (callbackToken !== expectedToken) {
      throw new UnauthorizedException('Invalid callback token');
    }

    return this.paymentService.handleWebhook(payload);
  }
}
