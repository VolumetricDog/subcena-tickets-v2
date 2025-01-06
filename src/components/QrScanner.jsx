"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function QrScanner({ onTicketIdChange }) {
  const [scanResult, setScanResult] = useState(null);
  const [isEventLocked, setIsEventLocked] = useState(false); // State for lock status

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(result) {
      scanner.clear();
      setScanResult(result);
      setIsEventLocked(true); // Save scanned QR code result
      if (onTicketIdChange) {
        onTicketIdChange(result); // Notify parent with the scanned result
      }
    }

    function onScanError(err) {
      console.warn(err);
    }

    return () => {
      scanner.clear(); // Clean up the scanner when the component unmounts
    };
  }, [onTicketIdChange]);

  return (
    <div className="max-w-3xl text-white mx-auto text-center items-center">
      {isEventLocked ? (
        <p className="text-green-600 text-xl font-bold">
          Ticket encontrado com sucesso!
        </p>
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
              className="bg-white border-0 outline-none shadow-lg overflow-hidden items-center p-8"
            ></div>
          )}
        </>
      )}
    </div>
  );
}

export default QrScanner;
