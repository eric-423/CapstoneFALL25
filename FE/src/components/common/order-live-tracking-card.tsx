'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrderLiveTracking } from '@/utils/hooks/useOrderLiveTracking';
import { cn } from '@/utils/lib/utils';

import { GoogleMap, Marker, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';
import { Loader2, Radio, RefreshCcw, Route } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface OrderLiveTrackingCardProps {
  orderId?: number;
  initialStatus?: string;
  destinationAddress?: string | null;
  className?: string;
}

const MAP_LIBRARIES: Libraries = ['marker'];
const DEFAULT_CENTER = { lat: 10.762622, lng: 106.660172 };

// const STATUS_CONFIG = {
//   UNPAID: { label: 'Chờ thanh toán', badgeClass: 'bg-yellow-500 text-white' },
//   VERIFIED: { label: 'Đã xác nhận', badgeClass: 'bg-blue-500 text-white' },
//   PROCESSING: { label: 'Đang chuẩn bị', badgeClass: 'bg-blue-500 text-white' },
//   IN_DELIVERY: { label: 'Đang giao', badgeClass: 'bg-blue-500 text-white' },
//   COMPLETED: { label: 'Hoàn thành', badgeClass: 'bg-green-600 text-white' },
//   CANCELLED: { label: 'Đã hủy', badgeClass: 'bg-red-500 text-white' },
// } as const;



export function OrderLiveTrackingCard({
  orderId,
  initialStatus,
  destinationAddress,
  className,
}: OrderLiveTrackingCardProps) {
  const hasOrder = Boolean(orderId);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [routeInfo, setRouteInfo] = useState<{ distanceText?: string; durationText?: string } | null>(null);

  const {
    lastUpdatedAt,
    shipperLocation,
  } = useOrderLiveTracking({
    orderId,
    initialStatus,
    enabled: hasOrder,
  });

  if (!hasOrder) {
    return null;
  }

  return (
    <Card className={cn('border border-foreground/10 shadow-sm', className)}>
      <CardHeader className='space-y-3'>
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <CardTitle className='text-lg font-semibold flex items-center gap-2'>
            <Radio className='h-5 w-5 text-primary' />
            Theo dõi đơn hàng của bạn
          </CardTitle>
          <div className='flex flex-wrap gap-2 text-xs'>


            {/* <Badge
              variant={isStatusConnected ? 'secondary' : 'outline'}
              className={cn('flex items-center gap-1', isStatusConnected ? 'text-primary' : 'text-muted-foreground')}
            >
              {isStatusConnected ? (
                <>
                  <Wifi className='h-3 w-3' />
                  Đã đồng bộ trạng thái
                </>
              ) : (
                <>
                  <WifiOff className='h-3 w-3' />
                  Mất kết nối trạng thái
                </>
              )}
            </Badge>
            <Badge
              variant={isLocationConnected ? 'secondary' : 'outline'}
              className={cn('flex items-center gap-1', isLocationConnected ? 'text-primary' : 'text-muted-foreground')}
            >
              {isLocationConnected ? (
                <>
                  <Navigation2 className='h-3 w-3' />
                  Đang nhận vị trí
                </>
              ) : (
                <>
                  <Navigation2 className='h-3 w-3 opacity-50' />
                  Đợi tín hiệu vị trí
                </>
              )}
            </Badge> */}


          </div>
        </div>
        {lastUpdatedAt && (
          <p className='text-xs text-muted-foreground flex items-center gap-1'>
            <RefreshCcw className='h-3 w-3' />
            Cập nhật gần nhất {lastUpdatedAt.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent className='space-y-4'>


        <Separator />

        <div className='space-y-3'>

          {shipperLocation ? (
            <div className='space-y-3 rounded-lg border border-primary/10 bg-primary/5 p-3 text-sm'>
              <div className='flex items-center gap-2 text-sm font-medium text-primary'>
                <Route className='h-4 w-4' />
                Lộ trình tới bạn
              </div>

              {shipperLocation.timestamp && (
                <p className='text-xs text-muted-foreground'>
                  {new Date(shipperLocation.timestamp).toLocaleTimeString()} &middot;{' '}
                  {shipperLocation.customerAddress || 'Đang di chuyển'}
                </p>
              )}

              {googleMapsApiKey && (
                <div className='h-[480px] w-full overflow-hidden rounded-xl border border-primary/10'>
                  <ShipperLocationMap
                    apiKey={googleMapsApiKey}
                    lat={shipperLocation.latitude}
                    lng={shipperLocation.longitude}
                    destinationAddress={shipperLocation.customerAddress || destinationAddress || undefined}
                    onRouteInfo={setRouteInfo}
                  />
                </div>
              )}


              {routeInfo && (
                <p className='text-xs text-muted-foreground'>
                  Quãng đường khoảng {routeInfo.distanceText || '...'} · Ước tính {routeInfo.durationText || '...'}
                </p>
              )}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>
              Dữ liệu vị trí sẽ hiển thị khi shipper bắt đầu di chuyển tới bạn.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderLiveTrackingCard;

interface ShipperLocationMapProps {
  lat: number;
  lng: number;
  apiKey: string;
  destinationAddress?: string;
  onRouteInfo?: (info: { distanceText?: string; durationText?: string } | null) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
} as const;

function ShipperLocationMap({ lat, lng, apiKey, destinationAddress, onRouteInfo }: ShipperLocationMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const center = useMemo(() => ({ lat: lat || DEFAULT_CENTER.lat, lng: lng || DEFAULT_CENTER.lng }), [lat, lng]);
  const [destinationLatLng, setDestinationLatLng] = useState<google.maps.LatLngLiteral | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [geocodingAddress, setGeocodingAddress] = useState<string | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: MAP_LIBRARIES,
    language: 'vi',
    region: 'VN',
    id: 'shipper-location-map-script',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
      zoomControl: true,
      streetViewControl: false,
    }),
    [],
  );

  const shipperIcon = useMemo(() => {
    if (typeof window === 'undefined' || !window.google || !isLoaded) return undefined;
    return {
      url: '/images/shipper.png',
      scaledSize: new window.google.maps.Size(30, 30),
      anchor: new window.google.maps.Point(14, 14),
    };
  }, [isLoaded]);

  // Icon tùy chỉnh cho điểm đến (địa chỉ khách hàng)
  const destinationIcon = useMemo(() => {
    if (typeof window === 'undefined' || !window.google || !isLoaded) return undefined;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 6,
      fillColor: '#4CAF50',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,

    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !window.google) return;
    if (!destinationAddress) {
      setDestinationLatLng(null);
      onRouteInfo?.(null);
      setGeocodingAddress(null);
      return;
    }
    if (geocodingAddress === destinationAddress) return;
    setGeocodingAddress(destinationAddress);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: destinationAddress }, (results, status) => {
      if (status === 'OK' && results && results[0]?.geometry?.location) {
        const location = results[0].geometry.location;
        setDestinationLatLng({ lat: location.lat(), lng: location.lng() });
      } else {
        setDestinationLatLng(null);
        onRouteInfo?.(null);
      }
    });
  }, [destinationAddress, geocodingAddress, isLoaded, onRouteInfo]);

  useEffect(() => {
    if (!isLoaded || !window.google) return;
    if (!destinationLatLng) {
      setDirections(null);
      return;
    }
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat, lng },
        destination: destinationLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs?.[0];
          onRouteInfo?.({
            distanceText: leg?.distance?.text,
            durationText: leg?.duration?.text,
          });
          if (mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            bounds.extend(new window.google.maps.LatLng(lat, lng));
            bounds.extend(new window.google.maps.LatLng(destinationLatLng.lat, destinationLatLng.lng));
            mapRef.current.fitBounds(bounds, 48);
          }
        } else {
          setDirections(null);
          onRouteInfo?.(null);
        }
      },
    );
  }, [destinationLatLng, isLoaded, lat, lng, onRouteInfo]);

  if (loadError) {
    return <p className='text-xs text-red-500'>Không thể tải bản đồ, vui lòng thử lại sau.</p>;
  }

  if (!isLoaded) {
    return (
      <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        Đang tải bản đồ...
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} onLoad={onLoad} options={mapOptions}>

      <Marker position={{ lat, lng }} icon={shipperIcon} />

      {destinationLatLng && <Marker position={destinationLatLng} icon={destinationIcon} />}

      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#FF6B00',
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
          }}
        />
      )}

    </GoogleMap>
  );
}


