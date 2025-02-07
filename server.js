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
        if (
          !args.ReferenceNumber ||
          !args.TransactionType ||
          !args.TransactionAmount
        ) {
          throw new Error(
            "Missing required fields: ReferenceNumber, TransactionType, or TransactionAmount"
          );
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
    console.log(
      `SOAP service is running at http://localhost:${PORT}/wsdl?wsdl`
    );
  });
});


// request url 
// http://localhost:3000/wsdl


// Request
// <?xml version="1.0"?>
//   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pay="http://example.com/paymentservice">
//      <soapenv:Header/>
//      <soapenv:Body>
//         <pay:VFI_GetAuth>
//            <ReferenceNumber>123456789</ReferenceNumber>
//            <TransactionType>SALE</TransactionType>
//            <TransactionAmount>100.50</TransactionAmount>
//            <InvoiceNo>INV-001</InvoiceNo>
//         </pay:VFI_GetAuth>
//      </soapenv:Body>
//   </soapenv:Envelope>

// Response
// <?xml version="1.0" encoding="utf-8"?>
// <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:tns="http://example.com/paymentservice">
//     <soap:Body>
//         <tns:VFI_GetAuthResponse>
//             <tns:status>Processing</tns:status>
//             <tns:message>Transaction initiated for ReferenceNumber: 123456789</tns:message>
//         </tns:VFI_GetAuthResponse>
//     </soap:Body>
// </soap:Envelope>
