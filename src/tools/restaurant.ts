import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Restaurant, Table, ServiceArea, DiningOption, RevenueCenter, PartnerAccess } from '../types/index.js';

/**
 * Restaurant Configuration Tools
 */

export function registerRestaurantTools(client: ToastClient) {
  return [
    {
      name: 'toast_get_restaurant_info',
      description: 'Get detailed restaurant configuration information',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        return { restaurant };
      },
    },

    {
      name: 'toast_list_accessible_restaurants',
      description: 'List all restaurants accessible with current API credentials',
      inputSchema: z.object({}),
      handler: async () => {
        const restaurants = await client.get<PartnerAccess[]>(
          `/partners/v1/restaurants`
        );
        return { restaurants, count: restaurants.length };
      },
    },

    {
      name: 'toast_list_tables',
      description: 'List all tables at a restaurant',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        return { tables: restaurant.tables || [], count: restaurant.tables?.length || 0 };
      },
    },

    {
      name: 'toast_get_table',
      description: 'Get information about a specific table',
      inputSchema: z.object({
        tableGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { tableGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        
        const table = restaurant.tables?.find(t => t.guid === args.tableGuid);
        if (!table) {
          throw new Error(`Table ${args.tableGuid} not found`);
        }

        return { table };
      },
    },

    {
      name: 'toast_list_service_areas',
      description: 'List all service areas (dining sections) at a restaurant',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        return { serviceAreas: restaurant.serviceAreas || [], count: restaurant.serviceAreas?.length || 0 };
      },
    },

    {
      name: 'toast_list_dining_options',
      description: 'List all dining options (dine-in, takeout, delivery, curbside, etc.)',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        return { diningOptions: restaurant.diningOptions || [], count: restaurant.diningOptions?.length || 0 };
      },
    },

    {
      name: 'toast_list_revenue_centers',
      description: 'List all revenue centers (bars, POS stations, etc.)',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        return { revenueCenters: restaurant.revenuecenters || [], count: restaurant.revenuecenters?.length || 0 };
      },
    },

    {
      name: 'toast_get_online_ordering_status',
      description: 'Check if online ordering is enabled and get scheduling info',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        
        return {
          enabled: restaurant.onlineOrderingInfo?.enabled || false,
          schedules: restaurant.onlineOrderingInfo?.schedules || [],
        };
      },
    },

    {
      name: 'toast_get_delivery_settings',
      description: 'Get delivery configuration (radius, minimum amount, etc.)',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const restaurant = await client.get<Restaurant>(
          `/restaurants/v1/restaurants/${restGuid}`
        );
        
        return {
          enabled: restaurant.deliveryInfo?.enabled || false,
          radius: restaurant.deliveryInfo?.radius,
          minimumAmount: restaurant.deliveryInfo?.minimumAmount,
        };
      },
    },
  ];
}
