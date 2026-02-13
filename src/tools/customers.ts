import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Customer, Order } from '../types/index.js';

/**
 * Customer Management Tools
 */

export function registerCustomersTools(client: ToastClient) {
  return [
    {
      name: 'toast_search_customers',
      description: 'Search for customers by phone, email, or name',
      inputSchema: z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
        name: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { phone?: string; email?: string; name?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        // Get recent orders to find customers
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // Last 90 days
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            startDate,
            endDate,
          }
        );

        const customers = new Map<string, Customer & { orderCount: number; lastOrderDate: string }>();

        orders.forEach(order => {
          order.checks.forEach(check => {
            if (check.customer) {
              const key = check.customer.phone || check.customer.email || check.customer.guid || '';
              if (key) {
                const existing = customers.get(key);
                if (existing) {
                  existing.orderCount++;
                  if (order.openedDate > existing.lastOrderDate) {
                    existing.lastOrderDate = order.openedDate;
                  }
                } else {
                  customers.set(key, {
                    ...check.customer,
                    orderCount: 1,
                    lastOrderDate: order.openedDate,
                  });
                }
              }
            }
          });
        });

        let results = Array.from(customers.values());

        // Filter by search criteria
        if (args.phone) {
          results = results.filter(c => c.phone === args.phone);
        }
        if (args.email) {
          results = results.filter(c => c.email?.toLowerCase() === args.email?.toLowerCase());
        }
        if (args.name) {
          const nameLower = args.name.toLowerCase();
          results = results.filter(c =>
            c.firstName?.toLowerCase().includes(nameLower) ||
            c.lastName?.toLowerCase().includes(nameLower)
          );
        }

        return { customers: results, count: results.length };
      },
    },

    {
      name: 'toast_get_customer_order_history',
      description: 'Get order history for a specific customer',
      inputSchema: z.object({
        phone: z.string().optional(),
        email: z.string().optional(),
        limit: z.number().optional().describe('Max number of orders to return'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { phone?: string; email?: string; limit?: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        if (!args.phone && !args.email) {
          throw new Error('Either phone or email must be provided');
        }

        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(); // Last year
        
        const allOrders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            startDate,
            endDate,
          }
        );

        const customerOrders = allOrders.filter(order =>
          order.checks.some(check =>
            check.customer &&
            ((args.phone && check.customer.phone === args.phone) ||
             (args.email && check.customer.email === args.email))
          )
        );

        // Sort by date descending
        customerOrders.sort((a, b) => new Date(b.openedDate).getTime() - new Date(a.openedDate).getTime());

        const limited = args.limit ? customerOrders.slice(0, args.limit) : customerOrders;

        const totalSpent = limited.reduce((sum, order) =>
          sum + order.checks.reduce((checkSum, check) => checkSum + (check.totalAmount || 0), 0),
        0);

        return {
          orders: limited,
          orderCount: limited.length,
          totalOrderCount: customerOrders.length,
          totalSpent,
        };
      },
    },

    {
      name: 'toast_get_customer_loyalty_status',
      description: 'Get loyalty program status for a customer',
      inputSchema: z.object({
        loyaltyIdentifier: z.string().describe('Phone number or loyalty card number'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { loyaltyIdentifier: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        // Search for orders with this loyalty identifier
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            startDate,
            endDate,
          }
        );

        const loyaltyOrders = orders.filter(order =>
          order.checks.some(check =>
            check.appliedLoyaltyInfo?.loyaltyIdentifier === args.loyaltyIdentifier
          )
        );

        const totalPoints = loyaltyOrders.reduce((sum, order) =>
          sum + order.checks.reduce((checkSum, check) => {
            if (check.appliedLoyaltyInfo?.loyaltyIdentifier === args.loyaltyIdentifier) {
              return checkSum + (check.totalAmount || 0);
            }
            return checkSum;
          }, 0),
        0);

        return {
          loyaltyIdentifier: args.loyaltyIdentifier,
          orderCount: loyaltyOrders.length,
          totalPoints: Math.floor(totalPoints / 100), // 1 point per dollar
          recentOrders: loyaltyOrders.slice(0, 5),
        };
      },
    },

    {
      name: 'toast_get_top_customers',
      description: 'Get top customers by order frequency or total spent',
      inputSchema: z.object({
        limit: z.number().optional().default(25),
        sortBy: z.enum(['frequency', 'totalSpent']).optional().default('totalSpent'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { limit?: number; sortBy?: 'frequency' | 'totalSpent'; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const limit = args.limit || 25;
        
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(); // Last 90 days
        
        const orders = await client.getAllPages<Order>(
          `/orders/v2/orders`,
          {
            restaurantGuid: restGuid,
            startDate,
            endDate,
          }
        );

        const customerStats = new Map<string, {
          phone?: string;
          email?: string;
          name?: string;
          orderCount: number;
          totalSpent: number;
          lastOrderDate: string;
        }>();

        orders.forEach(order => {
          order.checks.forEach(check => {
            if (check.customer) {
              const key = check.customer.phone || check.customer.email || '';
              if (key) {
                const existing = customerStats.get(key);
                const spent = check.totalAmount || 0;
                
                if (existing) {
                  existing.orderCount++;
                  existing.totalSpent += spent;
                  if (order.openedDate > existing.lastOrderDate) {
                    existing.lastOrderDate = order.openedDate;
                  }
                } else {
                  customerStats.set(key, {
                    phone: check.customer.phone,
                    email: check.customer.email,
                    name: `${check.customer.firstName || ''} ${check.customer.lastName || ''}`.trim(),
                    orderCount: 1,
                    totalSpent: spent,
                    lastOrderDate: order.openedDate,
                  });
                }
              }
            }
          });
        });

        let topCustomers = Array.from(customerStats.values());

        // Sort based on criteria
        if (args.sortBy === 'frequency') {
          topCustomers.sort((a, b) => b.orderCount - a.orderCount);
        } else {
          topCustomers.sort((a, b) => b.totalSpent - a.totalSpent);
        }

        return {
          customers: topCustomers.slice(0, limit),
          totalCustomers: customerStats.size,
        };
      },
    },
  ];
}
