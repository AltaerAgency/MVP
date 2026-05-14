import { prisma } from "./prisma";
import { logger } from "./logger";
export type AuditAction = "org.created"|"org.updated"|"org.plan_changed"|"member.joined"|"member.removed"|"site.created"|"site.deleted"|"document.uploaded"|"scan.started"|"scan.completed"|"scan.failed"|"issue.status_changed"|"fix.generated"|"fix.approved"|"fix.rejected"|"fix.applied"|"report.exported";
interface AuditEntry { organizationId: string; userId?: string|null; action: AuditAction; resourceType?: string; resourceId?: string; metadata?: Record<string,unknown>; requestId?: string; }
export async function audit(e: AuditEntry): Promise<void> {
  try { await prisma.auditEvent.create({ data: { organizationId: e.organizationId, userId: e.userId??null, action: e.action, resourceType: e.resourceType, resourceId: e.resourceId, metadata: e.metadata as never, requestId: e.requestId } }); }
  catch (err) { logger.error({ action: e.action, error: String(err) }, "audit write failed"); }
}
