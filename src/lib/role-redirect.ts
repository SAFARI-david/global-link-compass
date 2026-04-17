import type { AppRole } from "@/hooks/use-auth";

/**
 * Returns the default landing path for a user based on their roles.
 * Priority: admin > agent > applicant (default).
 */
export function getRoleHomePath(roles: AppRole[]): string {
  if (roles.includes("admin")) return "/admin/dashboard";
  if (roles.includes("agent")) return "/agents/dashboard";
  return "/dashboard";
}
