import { z } from 'zod';

export const leadCreateSchema = z.object({
  full_name: z.string().min(2).max(120),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(5).max(30).nullable().optional(),
  source: z.string().min(1).max(50).default('manual'),
  notes: z.string().max(2000).nullable().optional(),
});

export const leadUpdateSchema = z.object({
  full_name: z.string().min(2).max(120).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(5).max(30).nullable().optional(),
  source: z.string().min(1).max(50).optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost']).optional(),
  notes: z.string().max(2000).nullable().optional(),
});
