package com.capstone.tamtech.capstone.services;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket.name}")
    private String bucketName;

    private final OkHttpClient client = new OkHttpClient();

    public String uploadPdf(byte[] pdfBytes, String fileName) throws IOException {
        String uploadUrl = String.format("%s/storage/v1/object/%s/%s",
                supabaseUrl, bucketName, fileName);

        RequestBody requestBody = RequestBody.create(
                pdfBytes,
                MediaType.parse("application/pdf"));

        Request request = new Request.Builder()
                .url(uploadUrl)
                .post(requestBody)
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .addHeader("Content-Type", "application/pdf")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to upload to Supabase: " + response.message());
            }

            return getPublicUrl(fileName);
        }
    }

    public String uploadOrderBill(byte[] pdfBytes, int orderId) throws IOException {
        String fileName = String.format("bill-%d-%s.pdf", orderId, UUID.randomUUID().toString());
        return uploadPdf(pdfBytes, fileName);
    }

    public String getPublicUrl(String fileName) {
        return String.format("%s/storage/v1/object/public/%s/%s",
                supabaseUrl, bucketName, fileName);
    }

    public void deleteFile(String fileName) throws IOException {
        String deleteUrl = String.format("%s/storage/v1/object/%s/%s",
                supabaseUrl, bucketName, fileName);

        Request request = new Request.Builder()
                .url(deleteUrl)
                .delete()
                .addHeader("Authorization", "Bearer " + supabaseKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Failed to delete from Supabase: " + response.message());
            }
        }
    }
}
