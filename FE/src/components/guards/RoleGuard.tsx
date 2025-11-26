"use client";

import { useAuthContext } from "@/utils/contexts/AuthContext";
import { useNavigation } from "@/utils/hooks/useNavigation";
import { useEffect } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = "/403",
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthContext();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const hasPermission = allowedRoles.includes(user.role);

      if (!hasPermission) {
        navigate(fallbackPath, { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, fallbackPath, navigate]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["ADMIN"]}>{children}</RoleGuard>;
}

export function ManagerGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["ADMIN", "MANAGER"]}>{children}</RoleGuard>;
}

export function CustomerGuard({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["CUSTOMER", "MANAGER", "ADMIN"]}>
      {children}
    </RoleGuard>
  );
}

export function ChefGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["CHEFF"]}>{children}</RoleGuard>;
}

export function StaffGuard({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["STAFF", "Staff"]}>{children}</RoleGuard>;
}
