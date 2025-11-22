import { useEffect, useState } from 'react';

import {
  CustomerOrderStatusUpdate,
  useCustomerOrderSocket,
} from '@/utils/hooks/useCustomerOrderSocket';
import {
  ShipperLocationUpdate,
  useShipperLocationForCustomer,
} from '@/utils/hooks/useShipperLocationForCustomer';

interface UseOrderLiveTrackingOptions {
  orderId?: number;
  initialStatus?: string;
  enabled?: boolean;
}

export const useOrderLiveTracking = ({
  orderId,
  initialStatus = '',
  enabled = true,
}: UseOrderLiveTrackingOptions) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const isEnabled = Boolean(orderId) && enabled;

  const { orderStatus, isConnected: isStatusConnected } = useCustomerOrderSocket({
    orderId,
    enabled: isEnabled,
  });

  const { shipperLocation, isConnected: isLocationConnected } = useShipperLocationForCustomer(orderId, {
    enabled: isEnabled,
  });

  useEffect(() => {
    setCurrentStatus(initialStatus);
    setStatusMessage(null);
    setLastUpdatedAt(null);
  }, [initialStatus, orderId]);

  useEffect(() => {
    if (!orderStatus) return;

    const normalizedStatus = orderStatus.status || orderStatus.statusName;
    if (normalizedStatus) {
      setCurrentStatus(normalizedStatus);
    }

    if (orderStatus.message) {
      setStatusMessage(orderStatus.message);
    }

    if (orderStatus.timestamp) {
      const parsed = new Date(orderStatus.timestamp);
      if (!Number.isNaN(parsed.getTime())) {
        setLastUpdatedAt(parsed);
        return;
      }
    }

    setLastUpdatedAt(new Date());
  }, [orderStatus]);

  return {
    currentStatus,
    statusMessage,
    lastUpdatedAt,
    shipperLocation,
    orderStatus,
    isStatusConnected,
    isLocationConnected,
  } as {
    currentStatus: string;
    statusMessage: string | null;
    lastUpdatedAt: Date | null;
    shipperLocation: ShipperLocationUpdate | null;
    orderStatus: CustomerOrderStatusUpdate | null;
    isStatusConnected: boolean;
    isLocationConnected: boolean;
  };
};

export default useOrderLiveTracking;

