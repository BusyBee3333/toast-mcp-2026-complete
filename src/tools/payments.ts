import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Payment, Check } from '../types/index.js';

/**
 * Payment Management Tools
 */

export function registerPaymentsTools(client: ToastClient) {
  return [
    {
      name: 'toast_get_payment',
      description: 'Get detailed information about a specific payment',
      inputSchema: z.object({
        paymentGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { paymentGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const payment = await client.get<Payment>(
          `/orders/v2/payments/${args.paymentGuid}`,
          { restaurantGuid: restGuid }
        );
        return { payment };
      },
    },

    {
      name: 'toast_add_payment',
      description: 'Add a payment to a check (cash, card, other)',
      inputSchema: z.object({
        checkGuid: z.string(),
        amount: z.number().describe('Payment amount in cents'),
        tipAmount: z.number().optional().describe('Tip amount in cents'),
        paymentType: z.enum(['CASH', 'CREDIT', 'GIFTCARD', 'HOUSE_ACCOUNT', 'OTHER']),
        otherPaymentTypeGuid: z.string().optional().describe('Required if paymentType is OTHER'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: any) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const payment = await client.post<Payment>(
          `/orders/v2/checks/${args.checkGuid}/payments`,
          {
            amount: args.amount,
            tipAmount: args.tipAmount,
            type: args.paymentType,
            otherPaymentTypeGuid: args.otherPaymentTypeGuid,
          },
          { params: { restaurantGuid: restGuid } }
        );
        return { payment };
      },
    },

    {
      name: 'toast_refund_payment',
      description: 'Process a refund for a payment',
      inputSchema: z.object({
        paymentGuid: z.string(),
        refundAmount: z.number().describe('Refund amount in cents'),
        tipRefundAmount: z.number().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { paymentGuid: string; refundAmount: number; tipRefundAmount?: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.post(
          `/orders/v2/payments/${args.paymentGuid}/refund`,
          {
            refundAmount: args.refundAmount,
            tipRefundAmount: args.tipRefundAmount,
          },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_void_payment',
      description: 'Void a payment',
      inputSchema: z.object({
        paymentGuid: z.string(),
        voidReason: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { paymentGuid: string; voidReason?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.post(
          `/orders/v2/payments/${args.paymentGuid}/void`,
          { voidReason: args.voidReason },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_get_check_payments',
      description: 'Get all payments associated with a check',
      inputSchema: z.object({
        checkGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { checkGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const check = await client.get<Check>(
          `/orders/v2/checks/${args.checkGuid}`,
          { restaurantGuid: restGuid }
        );
        return { payments: check.payments || [], totalPaid: check.payments?.reduce((sum, p) => sum + p.amount, 0) || 0 };
      },
    },

    {
      name: 'toast_get_payment_summary',
      description: 'Get payment summary for a business date (totals by payment type)',
      inputSchema: z.object({
        businessDate: z.number().describe('Business date in YYYYMMDD format'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        // Note: In a real implementation, this would use a dedicated reporting endpoint
        // For now, we'll aggregate from orders
        const orders = await client.getAllPages(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        const paymentsByType: Record<string, { amount: number; tipAmount: number; count: number }> = {};
        
        orders.forEach((order: any) => {
          order.checks?.forEach((check: any) => {
            check.payments?.forEach((payment: any) => {
              const type = payment.type || 'UNKNOWN';
              if (!paymentsByType[type]) {
                paymentsByType[type] = { amount: 0, tipAmount: 0, count: 0 };
              }
              paymentsByType[type].amount += payment.amount || 0;
              paymentsByType[type].tipAmount += payment.tipAmount || 0;
              paymentsByType[type].count += 1;
            });
          });
        });

        return { businessDate: args.businessDate, paymentsByType };
      },
    },
  ];
}
