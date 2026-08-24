/**
 * Payment Service - frontend API client.
 *
 * The C6 website talks only to the C6 backend payment boundary. The backend
 * routes payment creation to RemotePay Fintech Services; provider details do
 * not belong in the frontend.
 */

export interface PaymentInitiateRequest {
  amount: number;
  currency?: string;
  description: string;
  packageId: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitiateResponse {
  success: boolean;
  data?: {
    paymentId: string;
    transactionId: string;
    checkoutUrl: string;
    paymentUrl?: string;
    status: string;
    provider?: 'remotepay';
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
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
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
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Create a payment through the C6 -> RemotePay boundary. */
export async function initiateRemotePayPayment(
  request: PaymentInitiateRequest
): Promise<PaymentInitiateResponse> {
  const response = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      amount: request.amount,
      currency: request.currency || 'ZAR',
      description: request.description,
      paymentMethod: 'remote-pay',
      metadata: {
        ...request.metadata,
        packageId: request.packageId,
      },
    }),
  });

  return response.json();
}

/** @deprecated Use initiateRemotePayPayment. */
export const initiateSimplyBluPayment = initiateRemotePayPayment;

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const response = await fetch(`${API_BASE}/payments/${paymentId}/status`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function getPaymentHistory(page: number = 1, limit: number = 20) {
  const response = await fetch(
    `${API_BASE}/payments/history?page=${page}&limit=${limit}`,
    { headers: getAuthHeaders() }
  );
  return response.json();
}

export async function getPaymentMethods() {
  const response = await fetch(`${API_BASE}/payments/methods`, {
    headers: getAuthHeaders(),
  });
  return response.json();
}

export async function createPayment(paymentData: {
  amount: number;
  currency?: string;
  paymentMethod?: string;
  description: string;
  metadata?: Record<string, unknown>;
}) {
  const response = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      ...paymentData,
      paymentMethod: 'remote-pay',
    }),
  });
  return response.json();
}
