import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { logger } from "./logger";
import type { Permission, Role } from "./rbac";
import { can } from "./rbac";

export interface TenantContext { userId: string; clerkUserId: string; organizationId: string; clerkOrgId: string; role: Role; }
export class AuthError extends Error { status: number; constructor(m: string, s: number) { super(m); this.status=s; } }

export async function getTenantContext(): Promise<TenantContext|null> {
  const { userId: clerkUserId, orgId: clerkOrgId } = await auth();
  if (!clerkUserId || !clerkOrgId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: { memberships: { where: { organization: { clerkOrgId } }, include: { organization: true }, take: 1 } },
  });
  if (!user) return null;
  const m = user.memberships[0];
  if (!m) return null;
  return { userId: user.id, clerkUserId, organizationId: m.organizationId, clerkOrgId, role: m.role as Role };
}
export async function requireTenantContext(): Promise<TenantContext> {
  const ctx = await getTenantContext();
  if (!ctx) throw new AuthError("Not authenticated", 401);
  return ctx;
}
export async function requirePermission(permission: Permission): Promise<TenantContext> {
  const ctx = await requireTenantContext();
  if (!can(ctx.role, permission)) { logger.warn({ userId: ctx.userId, permission }, "permission denied"); throw new AuthError(`Missing permission: ${permission}`, 403); }
  return ctx;
}
export function authErrorResponse(err: unknown, requestId: string): Response {
  if (err instanceof AuthError) return Response.json({ error: err.message, requestId }, { status: err.status, headers: { "X-Request-Id": requestId } });
  throw err;
}
