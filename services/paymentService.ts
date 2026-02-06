
export interface PaymentResult {
  status: 'approved' | 'rejected';
  transactionId: string;
  error?: string;
}

export const processSimulatedPayment = async (amount: number, method: string): Promise<PaymentResult> => {
  console.log(`Iniciando pago de ${amount} vía ${method}...`);
  
  // Latencia realista de validación bancaria
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulación de tasa de éxito del 85%
  const isApproved = Math.random() > 0.15;

  if (isApproved) {
    return {
      status: 'approved',
      transactionId: 'TX-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };
  } else {
    return {
      status: 'rejected',
      transactionId: '',
      error: 'La tarjeta no tiene fondos suficientes o fue rechazada por el emisor.'
    };
  }
};
