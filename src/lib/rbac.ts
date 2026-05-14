export type Role = "owner"|"admin"|"accessibility_lead"|"editor"|"developer"|"viewer"|"auditor";
export type Permission = "org:update"|"org:manage_billing"|"member:invite"|"member:remove"|"site:create"|"site:update"|"site:delete"|"document:upload"|"scan:create"|"scan:view"|"issue:view"|"issue:change_status"|"fix:approve"|"fix:apply"|"fix:reject"|"report:export"|"audit:view";
const matrix: Record<Role,Permission[]> = {
  owner:["org:update","org:manage_billing","member:invite","member:remove","site:create","site:update","site:delete","document:upload","scan:create","scan:view","issue:view","issue:change_status","fix:approve","fix:apply","fix:reject","report:export","audit:view"],
  admin:["member:invite","member:remove","site:create","site:update","site:delete","document:upload","scan:create","scan:view","issue:view","issue:change_status","fix:approve","fix:apply","fix:reject","report:export","audit:view"],
  accessibility_lead:["site:create","site:update","document:upload","scan:create","scan:view","issue:view","issue:change_status","fix:approve","fix:apply","fix:reject","report:export","audit:view"],
  editor:["scan:create","scan:view","issue:view","issue:change_status","fix:approve"],
  developer:["scan:create","scan:view","issue:view","issue:change_status","fix:apply","fix:reject"],
  viewer:["scan:view","issue:view"],
  auditor:["scan:view","issue:view","report:export","audit:view"],
};
export function can(role: Role, permission: Permission): boolean { return matrix[role]?.includes(permission)??false; }
