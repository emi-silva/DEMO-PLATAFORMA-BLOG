export type SessionUser = {
  id: string;
  name: string;
  role: "admin" | "reader";
};

// Placeholder hooks to wire in your auth provider later.
export async function getSessionUser(): Promise<SessionUser | null> {
  return null;
}

export function canEdit(user: SessionUser | null) {
  return user?.role === "admin";
}
