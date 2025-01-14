package com.example.project.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class ProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectApplication.class, args);
    }

    @PostMapping("/transferAmount")
    public TransferAmountResponse transferAmount(@RequestParam String name, @RequestParam String city) {
        if (name == null || name.isEmpty() || city == null || city.isEmpty()) {
            throw new IllegalArgumentException("Both 'name' and 'city' parameters are required.");
        }

        String[] amounts = TransactionService.transferAmount(name, city);
        return new TransferAmountResponse(amounts[0], amounts[1]);
    }

    public static class TransferAmountResponse {
        private String maxCredit;
        private String maxDebit;

        public TransferAmountResponse(String maxCredit, String maxDebit) {
            this.maxCredit = maxCredit;
            this.maxDebit = maxDebit;
        }

        public String getMaxCredit() {
            return maxCredit;
        }

        public void setMaxCredit(String maxCredit) {
            this.maxCredit = maxCredit;
        }

        public String getMaxDebit() {
            return maxDebit;
        }

        public void setMaxDebit(String maxDebit) {
            this.maxDebit = maxDebit;
        }
    }
}
