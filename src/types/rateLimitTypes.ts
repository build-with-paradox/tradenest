import { NextApiRequest } from 'next';

export interface RateLimitRequestInterface extends NextApiRequest {
  headers: {
    'x-forwarded-for'?: string;
    [key: string]: string | undefined;
  };
}
