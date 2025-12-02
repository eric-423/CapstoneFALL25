"use client";

import { ManagerGuard } from "@/components/guards";
import { BranchOrdersPage } from "@/app/components/orders/branch-orders-page";

export default function ManagerOrdersPage() {
  return (
    <ManagerGuard>
      <BranchOrdersPage variant="manager" />
    </ManagerGuard>
  );
}

