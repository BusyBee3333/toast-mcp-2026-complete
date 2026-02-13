import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Order, MenuItemSales } from '../types/index.js';

/**
 * Reporting & Analytics Tools
 */

export function registerReportingTools(client: ToastClient) {
  return [
    {
      name: 'toast_get_sales_summary',
      description: 'Get comprehensive sales summary for a business date',
      inputSchema: z.object({
        businessDate: z.number().describe('Business date in YYYYMMDD format'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        let totalSales = 0;
        let grossSales = 0;
        let netSales = 0;
        let taxAmount = 0;
        let tipAmount = 0;
        let discountAmount = 0;
        let voidAmount = 0;
        let refundAmount = 0;
        let guestCount = 0;
        let checkCount = 0;

        orders.forEach(order => {
          if (order.voided) {
            voidAmount += order.checks.reduce((sum, check) => sum + (check.totalAmount || 0), 0);
            return;
          }

          guestCount += order.numberOfGuests || 0;
          checkCount += order.checks.length;

          order.checks.forEach(check => {
            grossSales += check.amount || 0;
            taxAmount += check.taxAmount || 0;
            totalSales += check.totalAmount || 0;

            check.payments?.forEach(payment => {
              tipAmount += payment.tipAmount || 0;
              if (payment.refund) {
                refundAmount += payment.refund.refundAmount || 0;
              }
            });

            check.appliedDiscounts?.forEach(discount => {
              discountAmount += discount.discountAmount || 0;
            });
          });
        });

        netSales = grossSales - discountAmount;

        return {
          businessDate: args.businessDate,
          totalSales,
          grossSales,
          netSales,
          taxAmount,
          tipAmount,
          discountAmount,
          voidAmount,
          refundAmount,
          guestCount,
          checkCount,
          averageCheck: checkCount > 0 ? netSales / checkCount : 0,
          averageGuestSpend: guestCount > 0 ? netSales / guestCount : 0,
        };
      },
    },

    {
      name: 'toast_get_hourly_sales',
      description: 'Get sales broken down by hour for a business date',
      inputSchema: z.object({
        businessDate: z.number(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        const hourlyData: Record<number, { sales: number; orders: number; guests: number }> = {};

        orders.forEach(order => {
          if (order.voided) return;

          const hour = new Date(order.openedDate).getHours();
          if (!hourlyData[hour]) {
            hourlyData[hour] = { sales: 0, orders: 0, guests: 0 };
          }

          hourlyData[hour].orders++;
          hourlyData[hour].guests += order.numberOfGuests || 0;

          order.checks.forEach(check => {
            hourlyData[hour].sales += check.totalAmount || 0;
          });
        });

        const hourlyArray = Array.from({ length: 24 }, (_, hour) => ({
          hour,
          ...( hourlyData[hour] || { sales: 0, orders: 0, guests: 0 }),
        }));

        return {
          businessDate: args.businessDate,
          hourlyBreakdown: hourlyArray,
        };
      },
    },

    {
      name: 'toast_get_item_sales_report',
      description: 'Get sales report for menu items',
      inputSchema: z.object({
        businessDate: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().optional().describe('Return top N items'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate?: number; startDate?: string; endDate?: string; limit?: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
            startDate: args.startDate,
            endDate: args.endDate,
          }
        );

        const itemSales = new Map<string, MenuItemSales>();

        orders.forEach(order => {
          if (order.voided) return;

          order.checks.forEach(check => {
            check.selections.forEach(selection => {
              if (selection.voided) return;

              const existing = itemSales.get(selection.itemGuid);
              if (existing) {
                existing.quantity += selection.quantity;
                existing.grossSales += selection.price;
                existing.netSales += selection.price - (selection.appliedDiscounts?.reduce((sum, d) => sum + d.discountAmount, 0) || 0);
              } else {
                itemSales.set(selection.itemGuid, {
                  itemGuid: selection.itemGuid,
                  itemName: selection.displayName,
                  quantity: selection.quantity,
                  grossSales: selection.price,
                  netSales: selection.price - (selection.appliedDiscounts?.reduce((sum, d) => sum + d.discountAmount, 0) || 0),
                });
              }
            });
          });
        });

        let items = Array.from(itemSales.values());
        items.sort((a, b) => b.netSales - a.netSales);

        if (args.limit) {
          items = items.slice(0, args.limit);
        }

        return {
          items,
          totalItems: items.length,
          totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
          totalSales: items.reduce((sum, item) => sum + item.netSales, 0),
        };
      },
    },

    {
      name: 'toast_get_payment_type_report',
      description: 'Get breakdown of sales by payment type',
      inputSchema: z.object({
        businessDate: z.number(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        const paymentTypes: Record<string, { amount: number; tipAmount: number; count: number }> = {};

        orders.forEach(order => {
          order.checks.forEach(check => {
            check.payments?.forEach(payment => {
              const type = payment.type || 'UNKNOWN';
              if (!paymentTypes[type]) {
                paymentTypes[type] = { amount: 0, tipAmount: 0, count: 0 };
              }
              paymentTypes[type].amount += payment.amount;
              paymentTypes[type].tipAmount += payment.tipAmount || 0;
              paymentTypes[type].count++;
            });
          });
        });

        return {
          businessDate: args.businessDate,
          paymentTypes,
        };
      },
    },

    {
      name: 'toast_get_discount_report',
      description: 'Get report on discounts applied',
      inputSchema: z.object({
        businessDate: z.number(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        const discounts: Record<string, { name: string; amount: number; count: number }> = {};

        orders.forEach(order => {
          order.checks.forEach(check => {
            check.appliedDiscounts?.forEach(discount => {
              const key = discount.discountGuid;
              if (!discounts[key]) {
                discounts[key] = { name: discount.name, amount: 0, count: 0 };
              }
              discounts[key].amount += discount.discountAmount;
              discounts[key].count++;
            });
          });
        });

        const discountArray = Object.entries(discounts).map(([guid, data]) => ({
          discountGuid: guid,
          ...data,
        }));

        discountArray.sort((a, b) => b.amount - a.amount);

        return {
          businessDate: args.businessDate,
          discounts: discountArray,
          totalDiscountAmount: discountArray.reduce((sum, d) => sum + d.amount, 0),
        };
      },
    },

    {
      name: 'toast_get_void_report',
      description: 'Get report on voided orders and items',
      inputSchema: z.object({
        businessDate: z.number(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        const voidedOrders = orders.filter(o => o.voided);
        const voidedSelections: any[] = [];

        orders.forEach(order => {
          order.checks.forEach(check => {
            check.selections.forEach(selection => {
              if (selection.voided) {
                voidedSelections.push({
                  orderGuid: order.guid,
                  itemName: selection.displayName,
                  quantity: selection.quantity,
                  amount: selection.price,
                  voidDate: selection.voidDate,
                });
              }
            });
          });
        });

        const totalVoidedAmount =
          voidedOrders.reduce((sum, order) =>
            sum + order.checks.reduce((checkSum, check) => checkSum + (check.totalAmount || 0), 0),
          0) +
          voidedSelections.reduce((sum, sel) => sum + sel.amount, 0);

        return {
          businessDate: args.businessDate,
          voidedOrderCount: voidedOrders.length,
          voidedSelectionCount: voidedSelections.length,
          totalVoidedAmount,
          voidedOrders: voidedOrders.map(o => ({
            orderGuid: o.guid,
            voidDate: o.voidDate,
            amount: o.checks.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
          })),
          voidedSelections,
        };
      },
    },
  ];
}
