// const fs = require("fs");
// const express = require("express");
const soap = require("soap");
const bodyParser = require("body-parser");

// const app = express();
// const soap = require('soap');
const http = require('http');

// Define service methods
const service = {
  BankPaymentService: {
    BankPaymentPort: {
      VFI_GetAuth: function (args, callback) {
        console.log("Received request:", args);

        // Mock Response Data
        const response = {
          Status: "Success",
          Message: "Transaction Approved",
          TransactionID: "TXN12345678"
        };

        callback(null, response);
      }
    }
  }
};

// Load WSDL
const xml = require('fs').readFileSync('bankpayment.wsdl', 'utf8');
const server = http.createServer((req, res) => {
  res.end("SOAP API Running...");
});

// Create SOAP Server
soap.listen(server, "/wsdl", service, xml);

server.listen(3000, () => {
  console.log("SOAP API listening on port 3000");
});
