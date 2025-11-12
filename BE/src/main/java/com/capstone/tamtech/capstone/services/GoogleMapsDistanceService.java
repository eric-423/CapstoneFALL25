package com.capstone.tamtech.capstone.services;

import com.google.maps.DistanceMatrixApi;
import com.google.maps.GeoApiContext;
import com.google.maps.model.DistanceMatrix;
import com.google.maps.model.DistanceMatrixElement;
import com.google.maps.model.TravelMode;
import com.google.maps.model.Unit;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GoogleMapsDistanceService implements DistanceService {

    @Value("${google.map.key:}")
    private String googleApiKey;

    private GeoApiContext context;

    @Override
    public long getDistanceInMeters(String originAddress, String destinationAddress) {
        System.out.println("=== Google Maps Distance Matrix (Official Library) ===");
        System.out.println("Origin: " + originAddress);
        System.out.println("Destination: " + destinationAddress);

        if (originAddress == null || destinationAddress == null || originAddress.isBlank()
                || destinationAddress.isBlank()) {
            System.out.println("ERROR: Address is null or blank");
            return -1;
        }

        if (googleApiKey == null || googleApiKey.isBlank()) {
            System.out.println("ERROR: Google API key is null or blank");
            return -1;
        }

        try {
            if (context == null) {
                context = new GeoApiContext.Builder()
                        .apiKey(googleApiKey)
                        .build();
                System.out.println("GeoApiContext initialized with API key");
            }

            DistanceMatrix matrix = DistanceMatrixApi.newRequest(context)
                    .origins(originAddress)
                    .destinations(destinationAddress)
                    .mode(TravelMode.DRIVING)
                    .units(Unit.METRIC)
                    .language("vi")
                    .await();

            System.out.println("API Response Status: " + matrix.rows.length + " rows");
            System.out.println("Origin Address from API: "
                    + (matrix.originAddresses.length > 0 ? matrix.originAddresses[0] : "N/A"));
            System.out.println("Destination Address from API: "
                    + (matrix.destinationAddresses.length > 0 ? matrix.destinationAddresses[0] : "N/A"));

            if (matrix.rows.length == 0) {
                System.out.println("ERROR: No rows in response");
                return -1;
            }

            DistanceMatrixElement element = matrix.rows[0].elements[0];
            System.out.println("Element Status: " + element.status);

            if (element.status != com.google.maps.model.DistanceMatrixElementStatus.OK) {
                System.out.println("ERROR: Element status is not OK: " + element.status);
                return -1;
            }

            long meters = element.distance.inMeters;
            System.out.println("✅ Distance: " + meters + " meters (" + element.distance.humanReadable + ")");
            System.out.println("✅ Duration: " + element.duration.humanReadable);
            System.out.println("=== SUCCESS ===");

            return meters;
        } catch (Exception e) {
            System.out.println("ERROR: Exception occurred: " + e.getMessage());
            e.printStackTrace();
            return -1;
        }
    }
}
