package com.example.project.project;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.client.CloseableHttpClient;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.List;
import java.util.ArrayList;
import java.util.Objects;

public class TransactionService {

    private static final String API_URL = "https://jsonmock.hackerrank.com/api/transactions?page=";
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final String CREDIT = "credit";
    private static final String DEBIT = "debit";

    // Fetch transactions for the given username and city
    public static List<Transaction> getTransactions(String username, String city) {
        List<Transaction> transactions = new ArrayList<>();
        int page = 1;

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            while (true) {
                String url = API_URL + page;
                HttpGet request = new HttpGet(url);
                HttpResponse response = httpClient.execute(request);

                if (response.getStatusLine().getStatusCode() != 200) {
                    System.err.println("Error: Failed to fetch data (status code: "
                            + response.getStatusLine().getStatusCode() + ")");
                    break;
                }

                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(response.getEntity().getContent()))) {
                    StringBuilder responseBody = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        responseBody.append(line);
                    }

                    ApiResponse apiResponse = mapper.readValue(responseBody.toString(), ApiResponse.class);

                    if (apiResponse.totalPages <= 0) {
                        System.err.println("Error: No pages available.");
                        break;
                    }

                    // Filter transactions for the given username and city
                    for (Transaction txn : apiResponse.data) {
                        if (Objects.nonNull(txn.username) && txn.username.equals(username)
                                && Objects.nonNull(txn.location) && txn.location.city.equals(city)) {
                            transactions.add(txn);
                        }
                    }

                    // Stop if there are no more pages or data
                    if (page >= apiResponse.totalPages || apiResponse.data.isEmpty()) {
                        break;
                    }
                    page++;
                }
            }
        } catch (Exception e) {
            System.err.println("An error occurred: " + e.getMessage());
            e.printStackTrace();
        }
        return transactions;
    }

    // Transfer amount by calculating max credit and debit amounts
    public static String[] transferAmount(String username, String city) {
        List<Transaction> transactions = getTransactions(username, city);
    
        double maxCredit = 0.0;
        double maxDebit = 0.0;
    
        // Find the max credit and debit
        for (Transaction txn : transactions) {
            double amount = parseCurrency(txn.amount);
    
            if (CREDIT.equalsIgnoreCase(txn.txnType)) {
                maxCredit = Math.max(maxCredit, amount);
            } else if (DEBIT.equalsIgnoreCase(txn.txnType)) {
                maxDebit = Math.max(maxDebit, amount);
            }
        }
    
        System.out.println("Max Credit: " + maxCredit + ", Max Debit: " + maxDebit);
    
        // Return formatted values
        return new String[] { formatCurrency(maxCredit), formatCurrency(maxDebit) };
    }

    // Parse the currency value (removes non-numeric characters)
    private static double parseCurrency(String amountStr) {
        if (amountStr == null || amountStr.isEmpty()) {
            return 0.0;
        }
        try {
            return Double.parseDouble(amountStr.replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            System.err.println("Error parsing amount: " + amountStr);
            return 0.0;
        }
    }

    // Format the currency value
    private static String formatCurrency(double amount) {
        if (amount == Double.MIN_VALUE) {
            return "$0.00";
        }
        return String.format("$%,.2f", amount);
    }

    // Data classes for the API response and transactions
    public static class ApiResponse {
        public int page;
        public int per_page;
        public int total;
        public int totalPages;
        public List<Transaction> data;
    }

    public static class Transaction {
        public String id;
        public String userId;
        public String username;
        public String timestamp;
        public String txnType;
        public String amount;
        public Location location;
        public String ip;
    }

    public static class Location {
        public String id;
        public String address;
        public String city;
        public String zipCode;
    }
}
