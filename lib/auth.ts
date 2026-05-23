export type JwtPayload = {
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  picture?: string;
  image?: string;
  avatar?: string;
  role?: string | string[];
  roles?: string | string[];
  isAdmin?: boolean;
  exp?: number;
};

export type AuthUser = {
  name: string;
  email: string;
  image?: string | null;
  isAdmin: boolean;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  const payload = token.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload | null) {
  if (!payload?.exp) {
    return false;
  }

  return payload.exp * 1000 <= Date.now();
}

function getRoleValues(payload: JwtPayload | null) {
  return [payload?.role, payload?.roles].flatMap((value) => {
    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  });
}

export function isAdminPayload(payload: JwtPayload | null) {
  if (!payload || isTokenExpired(payload)) {
    return false;
  }

  if (typeof payload.isAdmin === "boolean") {
    return payload.isAdmin;
  }

  return getRoleValues(payload).some((role) =>
    role.toLowerCase().includes("admin")
  );
}

export function getUserFromToken(token: string | undefined | null): AuthUser | null {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  if (!payload || isTokenExpired(payload)) {
    return null;
  }

  return {
    name:
      payload.name?.trim() ||
      payload.fullName?.trim() ||
      payload.username?.trim() ||
      payload.email?.split("@")[0] ||
      "My Account",
    email: payload.email?.trim() || "Signed in",
    image: payload.picture || payload.image || payload.avatar || null,
    isAdmin: isAdminPayload(payload),
  };
}
