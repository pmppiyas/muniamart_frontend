import { z } from 'zod';

export type DeliveryMethod = 'standard' | 'express';
export type PaymentMethod = 'cod' | 'bkash' | 'card';

export const checkoutFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name cannot exceed 80 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number (at least 10 digits)')
    .regex(/^[\d+\-\s()]+$/, 'Invalid phone number format'),

  streetAddress: z
    .string()
    .min(5, 'Street address must be at least 5 characters'),
  apartment: z.string().optional(),
  city: z
    .string()
    .min(2, 'City/District name is required'),
  state: z
    .string()
    .min(2, 'Division/State is required'),
  postalCode: z
    .string()
    .min(3, 'Postal/ZIP code is required'),
  deliveryNotes: z.string().optional(),

  deliveryMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cod', 'bkash', 'card']),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  totalAmount: number;
  items: {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    photoUrl?: string | null;
  }[];
  createdAt: string;
}
