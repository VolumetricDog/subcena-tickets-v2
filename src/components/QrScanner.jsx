"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function QrScanner({ onTicketIdChange }) {
  const [scanResult, setScanResult] = useState(null);
  const [isEventLocked, setIsEventLocked] = useState(false);

  useEffect(() => {
    const scannerId = "reader";

    // Check if the scanner container already exists and clear it
    const existingScanner = document.getElementById(scannerId);
    if (existingScanner) {
      existingScanner.innerHTML = "";
    }

    const scanner = new Html5QrcodeScanner(scannerId, {
      qrbox: {
        width: 200,
        height: 200,
      },
      fps: 5,
    });

    scanner.render(
      (result) => onScanSuccess(result),
      (err) => onScanError(err) // Handle errors gracefully
    );

    function onScanSuccess(result) {
      scanner.clear();
      document.getElementById(scannerId).innerHTML = ""; // Clear DOM content
      setScanResult(result);
      setIsEventLocked(true);
      if (onTicketIdChange) {
        onTicketIdChange(result);
      }
    }

    function onScanError(err) {
      // Ignore specific errors
      if (err === "NotFoundException") {
        return; // Ignore this error silently
      }
      console.warn("Scanner Error:", err); // Log other errors if needed
    }

    // Cleanup on unmount
    return () => {
      scanner.clear();
      const scannerContainer = document.getElementById(scannerId);
      if (scannerContainer) {
        scannerContainer.innerHTML = "";
      }
    };
  }, [onTicketIdChange]);

  return (
    <div className="max-w-3xl text-white mx-auto text-center items-center">
      {isEventLocked ? (
        <p className="text-green-600 text-md">QR code escaneado</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-center mb-5">Scan ticket</h1>
          {scanResult ? (
            <div style={{ marginTop: "20px" }}>
              <h2 className="font-semibold mb-2">Ticket ID:</h2>
              <p className="text-rose-800 inline-block px-4 py-1 bg-blue-50 drop-shadow-lg rounded-full">
                {scanResult}
              </p>
            </div>
          ) : (
            <div
              id="reader"
              className="border-0 outline-none shadow-lg overflow-hidden items-center p-8"
            ></div>
          )}
        </>
      )}
    </div>
  );
}

export default QrScanner;
