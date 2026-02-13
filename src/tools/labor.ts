import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Shift, TimeEntry, LaborReport } from '../types/index.js';

/**
 * Labor & Scheduling Tools
 */

export function registerLaborTools(client: ToastClient) {
  return [
    {
      name: 'toast_list_shifts',
      description: 'List shifts for a specific date range',
      inputSchema: z.object({
        businessDate: z.number().optional().describe('Business date in YYYYMMDD format'),
        startDate: z.string().optional().describe('ISO 8601 start date'),
        endDate: z.string().optional().describe('ISO 8601 end date'),
        employeeGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate?: number; startDate?: string; endDate?: string; employeeGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const shifts = await client.get<Shift[]>(
          `/labor/v1/shifts`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
            startDate: args.startDate,
            endDate: args.endDate,
            employeeGuid: args.employeeGuid,
          }
        );
        return { shifts, count: shifts.length };
      },
    },

    {
      name: 'toast_get_shift',
      description: 'Get detailed information about a specific shift',
      inputSchema: z.object({
        shiftGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { shiftGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const shift = await client.get<Shift>(
          `/labor/v1/shifts/${args.shiftGuid}`,
          { restaurantGuid: restGuid }
        );
        return { shift };
      },
    },

    {
      name: 'toast_get_active_shifts',
      description: 'Get all currently active/clocked-in shifts',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const today = new Date();
        const businessDate = parseInt(
          today.getFullYear().toString() +
          (today.getMonth() + 1).toString().padStart(2, '0') +
          today.getDate().toString().padStart(2, '0')
        );

        const shifts = await client.get<Shift[]>(
          `/labor/v1/shifts`,
          {
            restaurantGuid: restGuid,
            businessDate,
          }
        );

        const activeShifts = shifts.filter(shift => !shift.outDate && !shift.deleted);
        return { shifts: activeShifts, count: activeShifts.length };
      },
    },

    {
      name: 'toast_list_time_entries',
      description: 'List time entries (clock in/out events) for a date range',
      inputSchema: z.object({
        businessDate: z.number().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        employeeGuid: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate?: number; startDate?: string; endDate?: string; employeeGuid?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const timeEntries = await client.get<TimeEntry[]>(
          `/labor/v1/timeEntries`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
            startDate: args.startDate,
            endDate: args.endDate,
            employeeGuid: args.employeeGuid,
          }
        );
        return { timeEntries, count: timeEntries.length };
      },
    },

    {
      name: 'toast_get_labor_report',
      description: 'Get labor summary report for a business date',
      inputSchema: z.object({
        businessDate: z.number().describe('Business date in YYYYMMDD format'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { businessDate: number; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        // Get shifts for the day
        const shifts = await client.get<Shift[]>(
          `/labor/v1/shifts`,
          {
            restaurantGuid: restGuid,
            businessDate: args.businessDate,
          }
        );

        const totalHours = shifts.reduce((sum, shift) => 
          sum + (shift.regularHoursWorked || 0) + (shift.overtimeHoursWorked || 0), 0
        );
        const regularHours = shifts.reduce((sum, shift) => sum + (shift.regularHoursWorked || 0), 0);
        const overtimeHours = shifts.reduce((sum, shift) => sum + (shift.overtimeHoursWorked || 0), 0);
        const totalWages = shifts.reduce((sum, shift) => {
          const regular = (shift.regularHoursWorked || 0) * (shift.hourlyWage || 0);
          const overtime = (shift.overtimeHoursWorked || 0) * (shift.hourlyWage || 0) * 1.5;
          return sum + regular + overtime;
        }, 0);

        const uniqueEmployees = new Set(shifts.map(s => s.employeeReference?.employeeGuid).filter(Boolean));

        return {
          businessDate: args.businessDate,
          totalHours,
          regularHours,
          overtimeHours,
          totalWages,
          employeeCount: uniqueEmployees.size,
          shiftCount: shifts.length,
        };
      },
    },

    {
      name: 'toast_get_employee_hours',
      description: 'Get total hours worked by an employee for a date range',
      inputSchema: z.object({
        employeeGuid: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { employeeGuid: string; startDate: string; endDate: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        
        const shifts = await client.get<Shift[]>(
          `/labor/v1/shifts`,
          {
            restaurantGuid: restGuid,
            employeeGuid: args.employeeGuid,
            startDate: args.startDate,
            endDate: args.endDate,
          }
        );

        const totalHours = shifts.reduce((sum, shift) => 
          sum + (shift.regularHoursWorked || 0) + (shift.overtimeHoursWorked || 0), 0
        );
        const regularHours = shifts.reduce((sum, shift) => sum + (shift.regularHoursWorked || 0), 0);
        const overtimeHours = shifts.reduce((sum, shift) => sum + (shift.overtimeHoursWorked || 0), 0);

        return {
          employeeGuid: args.employeeGuid,
          startDate: args.startDate,
          endDate: args.endDate,
          totalHours,
          regularHours,
          overtimeHours,
          shiftCount: shifts.length,
        };
      },
    },
  ];
}
