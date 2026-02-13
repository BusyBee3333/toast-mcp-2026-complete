import { z } from 'zod';
import { ToastClient } from '../clients/toast.js';
import type { Employee, Job, TimeEntry } from '../types/index.js';

/**
 * Employee Management Tools
 */

export function registerEmployeesTools(client: ToastClient) {
  return [
    {
      name: 'toast_list_employees',
      description: 'List all employees at a restaurant',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
        includeDeleted: z.boolean().optional().describe('Include deleted employees'),
      }),
      handler: async (args: { restaurantGuid?: string; includeDeleted?: boolean }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const employees = await client.get<Employee[]>(
          `/labor/v1/employees`,
          { restaurantGuid: restGuid }
        );

        const filtered = args.includeDeleted
          ? employees
          : employees.filter(emp => !emp.deleted && !emp.disabled);

        return { employees: filtered, count: filtered.length };
      },
    },

    {
      name: 'toast_get_employee',
      description: 'Get detailed information about a specific employee',
      inputSchema: z.object({
        employeeGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { employeeGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const employee = await client.get<Employee>(
          `/labor/v1/employees/${args.employeeGuid}`,
          { restaurantGuid: restGuid }
        );
        return { employee };
      },
    },

    {
      name: 'toast_create_employee',
      description: 'Create a new employee',
      inputSchema: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        externalEmployeeId: z.string().optional(),
        chosenName: z.string().optional(),
        jobGuid: z.string().describe('Primary job GUID'),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: any) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const employee = await client.post<Employee>(
          `/labor/v1/employees`,
          {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            phone: args.phone,
            externalEmployeeId: args.externalEmployeeId,
            chosenName: args.chosenName,
            jobReferences: [{ jobGuid: args.jobGuid }],
          },
          { params: { restaurantGuid: restGuid } }
        );
        return { employee };
      },
    },

    {
      name: 'toast_update_employee',
      description: 'Update employee information',
      inputSchema: z.object({
        employeeGuid: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        chosenName: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: any) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const updates: any = {};
        if (args.firstName) updates.firstName = args.firstName;
        if (args.lastName) updates.lastName = args.lastName;
        if (args.email) updates.email = args.email;
        if (args.phone) updates.phone = args.phone;
        if (args.chosenName) updates.chosenName = args.chosenName;

        const result = await client.patch(
          `/labor/v1/employees/${args.employeeGuid}`,
          updates,
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, result };
      },
    },

    {
      name: 'toast_disable_employee',
      description: 'Disable an employee (prevents login but preserves data)',
      inputSchema: z.object({
        employeeGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { employeeGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const result = await client.patch(
          `/labor/v1/employees/${args.employeeGuid}`,
          { disabled: true },
          { params: { restaurantGuid: restGuid } }
        );
        return { success: true, employeeGuid: args.employeeGuid };
      },
    },

    {
      name: 'toast_list_jobs',
      description: 'List all job positions at a restaurant',
      inputSchema: z.object({
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const jobs = await client.get<Job[]>(
          `/labor/v1/jobs`,
          { restaurantGuid: restGuid }
        );
        return { jobs, count: jobs.length };
      },
    },

    {
      name: 'toast_get_job',
      description: 'Get detailed information about a job position',
      inputSchema: z.object({
        jobGuid: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { jobGuid: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const job = await client.get<Job>(
          `/labor/v1/jobs/${args.jobGuid}`,
          { restaurantGuid: restGuid }
        );
        return { job };
      },
    },

    {
      name: 'toast_search_employees',
      description: 'Search employees by name, email, or phone',
      inputSchema: z.object({
        query: z.string(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { query: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const employees = await client.get<Employee[]>(
          `/labor/v1/employees`,
          { restaurantGuid: restGuid }
        );

        const query = args.query.toLowerCase();
        const matches = employees.filter(emp =>
          !emp.deleted &&
          !emp.disabled &&
          (emp.firstName.toLowerCase().includes(query) ||
            emp.lastName.toLowerCase().includes(query) ||
            emp.email?.toLowerCase().includes(query) ||
            emp.phone?.includes(query))
        );

        return { employees: matches, count: matches.length };
      },
    },

    {
      name: 'toast_get_employee_time_entries',
      description: 'Get time entries (clock in/out) for an employee',
      inputSchema: z.object({
        employeeGuid: z.string(),
        businessDate: z.number().optional().describe('Business date in YYYYMMDD format'),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        restaurantGuid: z.string().optional(),
      }),
      handler: async (args: { employeeGuid: string; businessDate?: number; startDate?: string; endDate?: string; restaurantGuid?: string }) => {
        const restGuid = args.restaurantGuid || client.getRestaurantGuid();
        const timeEntries = await client.get<TimeEntry[]>(
          `/labor/v1/timeEntries`,
          {
            restaurantGuid: restGuid,
            employeeGuid: args.employeeGuid,
            businessDate: args.businessDate,
            startDate: args.startDate,
            endDate: args.endDate,
          }
        );
        return { timeEntries, count: timeEntries.length };
      },
    },
  ];
}
