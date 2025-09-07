interface ExchangeRateResponse {
  success: boolean;
  rates: {
    USD: number;
    INR: number;
  };
}

export async function getExchangeRate(): Promise<number> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data: ExchangeRateResponse = await response.json();
    
    if (data.success && data.rates.INR) {
      return data.rates.INR;
    }
    
    // Fallback rate if API fails
    return 83.12;
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return 83.12; // Fallback rate
  }
}

export function convertINRToUSD(inr: number, rate: number): number {
  return inr / rate;
}

export function convertUSDToINR(usd: number, rate: number): number {
  return usd * rate;
}

export function formatCurrency(amount: number, currency: 'INR' | 'USD'): string {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 1,
  }).format(amount);
}
