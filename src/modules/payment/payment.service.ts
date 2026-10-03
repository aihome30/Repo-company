import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { XenditService } from './xendit.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    // @InjectRepository(Payment)
    // private paymentRepo: Repository<Payment>,
    private readonly xenditService: XenditService,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const externalId = `WSPEND-${Date.now()}-${uuidv4().substring(0, 8)}`;
    this.logger.log(`Processing invoice creation for: ${externalId}`);

    const xenditRes = await this.xenditService.createInvoice({
      externalId,
      amount: dto.amount,
      payerEmail: dto.payerEmail,
      description: dto.description,
    });

    // Save initial payment record with status PENDING to PostgreSQL
    return {
      success: true,
      message: 'Invoice successfully generated',
      paymentId: externalId,
      invoiceUrl: xenditRes.invoiceUrl,
      amount: dto.amount,
      status: PaymentStatus.PENDING,
    };
  }

  async handleWebhook(payload: any) {
    this.logger.log(`Webhook received for externalId: ${payload.external_id} with status: ${payload.status}`);
    
    // Status translation: PAID, SETTLED, EXPIRED
    let status = PaymentStatus.PENDING;
    if (payload.status === 'PAID' || payload.status === 'SETTLED') {
      status = PaymentStatus.PAID;
    } else if (payload.status === 'EXPIRED') {
      status = PaymentStatus.EXPIRED;
    }

    // Update payment record in PostgreSQL
    return { received: true, status };
  }
}
