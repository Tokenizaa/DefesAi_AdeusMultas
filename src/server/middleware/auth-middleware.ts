/**
 * @file auth-middleware.ts
 * Express JWT Authentication & Authorization Middleware
 * Validates Supabase JWTs, enforces auth on protected routes, and provides admin guard.
 */

import { Request, Response, NextFunction } from 'express';
import { getSupabaseServerClient } from '../db/supabase-server';
import { logger } from '../observability/logger';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware that validates the Supabase JWT from the Authorization header.
 * - Missing token → 401
 * - Invalid/expired token → 401
 * - Valid token → populates req.user and calls next()
 * - Dev mode without Supabase → pass-through with mock user
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token =
      typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
      if (process.env.NODE_ENV !== 'production' || !getSupabaseServerClient()) {
        req.user = {
          id: 'dev_user',
          email: 'dev@local',
          role: 'admin',
          name: 'Desenvolvedor Local',
        };
        return next();
      }
      res.status(401).json({ error: 'Token de autenticação ausente' });
      return;
    }

    const supabase = getSupabaseServerClient();

    if (supabase) {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(token);

        if (user && !error) {
          const role = (user.user_metadata?.role as string) || 'citizen';
          req.user = {
            id: user.id,
            email: user.email || '',
            role,
            name: user.user_metadata?.name,
          };
          return next();
        }

        // Token invalid or expired
        res.status(401).json({ error: 'Token inválido ou expirado' });
        return;
      } catch (err: any) {
        logger.warn(
          'auth',
          'middleware',
          'token_verify_fail',
          `Falha ao validar token: ${err.message}`
        );
        res.status(401).json({ error: 'Token inválido ou expirado' });
        return;
      }
    }

    // Supabase not configured
    if (process.env.NODE_ENV === 'production') {
      res.status(401).json({ error: 'Serviço de autenticação indisponível' });
      return;
    }

    // Dev mode: allow pass-through with mock user
    logger.warn(
      'auth',
      'middleware',
      'dev_bypass',
      'Supabase não configurado — permitindo bypass em modo desenvolvimento'
    );
    req.user = {
      id: 'dev_user',
      email: 'dev@local',
      role: 'citizen',
    };
    return next();
  } catch (err: any) {
    logger.error('auth', 'middleware', 'unexpected_error', `Erro inesperado no auth: ${err.message}`);
    res.status(401).json({ error: 'Falha na autenticação' });
    return;
  }
}

/**
 * Middleware that enforces the request has a valid authenticated session.
 * Must be used AFTER authenticateToken.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: 'Não autorizado. Faça login para continuar.' });
    return;
  }
  next();
}

/**
 * Middleware that enforces the request was made by an admin user.
 * Must be used AFTER authenticateToken.
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: 'Não autorizado. Faça login como administrador.' });
    return;
  }

  if (user.role !== 'admin') {
    logger.warn(
      'auth',
      'middleware',
      'admin_access_denied',
      `Tentativa de acesso admin por usuário não autorizado (${user.email})`
    );
    res.status(403).json({ error: 'Acesso restrito a administradores' });
    return;
  }

  next();
}
