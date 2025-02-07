const express = require("express");
const soap = require("soap");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(bodyParser.raw({ type: () => true, limit: "5mb" }));

// Service Logic
const service = {
  PaymentService: {
    PaymentServicePort: {
      VFI_GetAuth: function (args) {
        if (!args.ReferenceNumber || !args.TransactionType || !args.TransactionAmount) {
          throw new Error("Missing required fields: ReferenceNumber, TransactionType, or TransactionAmount");
        }
        
        console.log("Received request:", args);
        
        // Simulate processing and sending request to VeriFone POS
        return {
          status: "Processing",
          message: `Transaction initiated for ReferenceNumber: ${args.ReferenceNumber}`,
        };
      },
    },
  },
};

// Read the WSDL file
const wsdlPath = "./service.wsdl";
const wsdl = fs.readFileSync(wsdlPath, "utf8");

// Create SOAP server
app.listen(PORT, () => {
  soap.listen(app, "/wsdl", service, wsdl, () => {
    console.log(`SOAP service is running at http://localhost:${PORT}/wsdl?wsdl`);
  });
});
