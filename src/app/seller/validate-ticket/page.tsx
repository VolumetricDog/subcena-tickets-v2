"use client";

import React, { useState } from "react";
import QrScanner from "@/components/QrScanner";
import EventIdReceiver from "@/components/EventIdReceiver";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CircleArrowDown } from "lucide-react";
import ValidateTicketButton from "@/components/ValidateTicketButton";

function ValidateTicket() {
  const [eventId, setEventId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [resetKey, setResetKey] = useState(0); // Key to trigger re-renders

  const ticket = useQuery(
    api.tickets.getTicketWithDetails,
    ticketId ? { ticketId: ticketId as Id<"tickets"> } : "skip"
  );

  const ticketEventId = ticket?.eventId;

  console.log("Ticket data:", ticket);
  console.log("Event ID:", eventId, "Ticket Event ID:", ticketEventId);

  // Function to re-render components
  const validateAgain = () => {
    setTicketId(""); // Clear the ticketId to reset the QR Scanner
    setResetKey((prevKey) => prevKey + 1); // Increment the key to re-render components
  };

  // Conditional rendering logic for invalid ticket or mismatched event ID
  if (!ticket || eventId !== ticketEventId) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center mt-8 justify-items-center gap-6 pb-10">
        <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <EventIdReceiver onEventIdChange={setEventId} />
        </div>

        <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <QrScanner key={resetKey} onTicketIdChange={setTicketId} />
        </div>
        <div className="bg-gray-900 text-white bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <p>Insira os dados de evento e do ticket</p>
        </div>
      </div>
    );
  }

  // Render when ticket is valid and eventId matches
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center mt-8 justify-items-center gap-6 pb-10">
      <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
        <EventIdReceiver onEventIdChange={setEventId} />
      </div>

      <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
        <QrScanner key={resetKey} onTicketIdChange={setTicketId} />
      </div>

      {ticket && eventId === ticketEventId && (
        <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden p-6 min-w-96 text-center">
          <ValidateTicketButton ticketId={ticket._id} />
        </div>
      )}

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
          <CircleArrowDown />
        </button>
      </div>
    </div>
  );
}

export default ValidateTicket;
