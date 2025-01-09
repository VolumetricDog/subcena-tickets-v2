"use client";

import React, { useState } from "react";
import QrScanner from "@/components/QrScanner";
import EventIdReceiver from "@/components/EventIdReceiver";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { LucideCircleX, RefreshCcwIcon } from "lucide-react";
import ValidateTicketButton from "@/components/ValidateTicketButton";
import { motion } from "framer-motion";

function ValidateTicket() {
  const [eventId, setEventId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const ticket = useQuery(
    api.tickets.getTicketWithDetails,
    ticketId ? { ticketId: ticketId as Id<"tickets"> } : "skip"
  );

  const ticketEventId = ticket?.eventId;

  console.log("Ticket data:", ticket);
  console.log("Event ID:", eventId, "Ticket Event ID:", ticketEventId);

  // Function to trigger QR Scanner display
  const handleEventIdChange = (newEventId: string) => {
    setEventId(newEventId);
    setShowQrScanner(true); // Show the QR Scanner only after eventId is set
  };

  const handleValidationSuccess = () => {
    console.log("Ticket validated successfully!");
    validateAgain();
    // Show the notification
    setShowNotification(true);

    // Automatically hide the notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Function to reset the validation process
  const validateAgain = () => {
    setTicketId(""); // Clear the ticket ID
    setShowQrScanner(false); // Hide QR Scanner temporarily
    setTimeout(() => {
      setShowQrScanner(true); // Show the QR Scanner again after a small delay to force re-mount
    }, 0);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center mt-8 justify-items-center gap-6 pb-10">
      {/* Event ID Receiver */}
      <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
        <EventIdReceiver onEventIdChange={handleEventIdChange} />
      </div>

      {/* QR Scanner */}
      {showQrScanner && (
        <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <QrScanner onTicketIdChange={setTicketId} />
        </div>
      )}

      {/* Invalid QR Code Message */}
      {ticketEventId !== eventId && ticket && (
        <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <LucideCircleX className="text-red-700 w-16 h-16 mb-2" />
            <p className="text-red-700 text-md">
              ticket escaneado inválido para este evento
            </p>
          </div>
        </div>
      )}

      {/* Validation Button */}
      {ticket && eventId === ticketEventId && (
        <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <ValidateTicketButton
            ticketId={ticket._id}
            onValidationSuccess={handleValidationSuccess}
          />
        </div>
      )}

      {/* Animated Notification */}
      {showNotification && (
        <motion.div
          className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          Ticket successfully validated!
        </motion.div>
      )}

      {/* Reset Button */}
      {eventId && (
        <div>
          <button
            onClick={validateAgain}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
            className="bg-rose-800 text-white px-4 py-2 rounded-full hover:bg-rose-900 transition-colors"
          >
            <RefreshCcwIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default ValidateTicket;
