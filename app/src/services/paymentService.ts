/**
 * Payment Service - Frontend API client for payment operations
 * 
 * This service handles all payment-related API calls to the backend,
 * including SimplyBlu payment initialization, status checks, and history.
 */

export interface PaymentInitiateRequest {
  amount: number;
  currency: string;
  description: string;
  packageId: string;
  metadata?: Record<string, any>;
}

export interface PaymentInitiateResponse {
  success: boolean;
  data?: {
    paymentId: string;
    transactionId: string;
    checkoutUrl: string;
    status: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data?: {
    paymentId: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    amount: number;
    currency: string;
    paymentMethod: string;
    paidAt: string | null;
    createdAt: string;
  };
}

const API_BASE = '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

/**
 * Initialize a SimplyBlu payment
 */
export async function initiateSimplyBluPayment(
  request: PaymentInitiateRequest
): Promise<PaymentInitiateResponse> {
  const response = await fetch(`${API_BASE}/payments/simplyblu/initiate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });

  return response.json();
}

/**
 * Get payment status by ID
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const response = await fetch(`${API_BASE}/payments/${paymentId}/status`, {
    headers: getAuthHeaders(),
  });

  return response.json();
}

/**
 * Get payment history for the current user
 */
export async function getPaymentHistory(page: number = 1, limit: number = 20) {
  const response = await fetch(
    `${API_BASE}/payments/history?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );

  return response.json();
}

/**
 * Get available payment methods
 */
export async function getPaymentMethods() {
  const response = await fetch(`${API_BASE}/payments/methods`, {
    headers: getAuthHeaders(),
  });

  return response.json();
}

/**
 * Create a generic payment (for backward compatibility)
 */
export async function createPayment(paymentData: {
  amount: number;
  currency?: string;
  paymentMethod: string;
  description: string;
  metadata?: Record<string, any>;
}) {
  const response = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(paymentData),
  });

  return response.json();
}
