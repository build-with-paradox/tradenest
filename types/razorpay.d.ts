interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id: string;
    handler: (response: any) => void;
    prefill?: {
      name: string;
      email: string;
      contact?: string;
    };
    notes?: Record<string, any>;
    theme?: {
      color: string;
    };
  }
  
  interface RazorpayInstance {
    open(): void;
    on(event: string, callback: (response: any) => void): void;
  }
  
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
  