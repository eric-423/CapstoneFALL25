package com.capstone.tamtech.capstone.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@Service
public class GoogleMapsDistanceService implements DistanceService {

    @Value("${google.map.key:}")
    private String googleApiKey;

    @Value("${google.map.api:https://maps.googleapis.com/maps/api}")
    private String googleApiBase;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public long getDistanceInMeters(String originAddress, String destinationAddress) {
        if (originAddress == null || destinationAddress == null || originAddress.isBlank() || destinationAddress.isBlank()) {
            return -1;
        }

        if (googleApiKey == null || googleApiKey.isBlank()) {
            return -1;
        }

        try {
            String origins = UriUtils.encode(originAddress, StandardCharsets.UTF_8);
            String destinations = UriUtils.encode(destinationAddress, StandardCharsets.UTF_8);
            String url = googleApiBase + "/distancematrix/json?units=metric&mode=driving"
                    + "&origins=" + origins
                    + "&destinations=" + destinations
                    + "&key=" + googleApiKey;

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                return -1;
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            String status = root.path("status").asText("");
            if (!"OK".equalsIgnoreCase(status)) {
                return -1;
            }

            JsonNode rows = root.path("rows");
            if (!rows.isArray() || rows.isEmpty()) {
                return -1;
            }
            JsonNode elements = rows.get(0).path("elements");
            if (!elements.isArray() || elements.isEmpty()) {
                return -1;
            }
            JsonNode element = elements.get(0);
            String elementStatus = element.path("status").asText("");
            if (!"OK".equalsIgnoreCase(elementStatus)) {
                return -1;
            }

            long meters = element.path("distance").path("value").asLong(-1);
            return meters;
        } catch (Exception e) {
            return -1;
        }
    }
}


