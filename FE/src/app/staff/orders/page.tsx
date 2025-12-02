"use client";

import { StaffGuard } from "@/components/guards";
import { BranchOrdersPage } from "@/app/components/orders/branch-orders-page";

export default function StaffOrdersPage() {
    return (
        <StaffGuard>
            <BranchOrdersPage variant="staff" />
        </StaffGuard>
    );
}

