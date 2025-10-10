import type { CustomInertia } from '../custom-inertia';

declare module 'express' {
  interface Request {
    user?: { id: number; name: string; email: string };
  }
  interface Response {
    inertia: CustomInertia;
  }
}
