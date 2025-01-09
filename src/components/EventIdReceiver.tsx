"use client";

import { useQuery } from "convex/react";
import { Check, CheckCircleIcon, XCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { api } from "../../convex/_generated/api";

interface EventIdProps {
  onEventIdChange: (eventId: any) => void; // Prop to notify the parent
}

const EventId: React.FC<EventIdProps> = ({ onEventIdChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [isEventLocked, setIsEventLocked] = useState(false); // State for lock status
  const [error, setError] = useState(""); // State to track error messages

  // Fetch event using password
  const event = useQuery(api.events.getByPassword, {
    password: inputValue,
  });

  const handleConfirm = () => {
    if (event) {
      console.log(event?.name); // Log event name if successful

      // Take action based on the query result
      onEventIdChange(event._id); // Notify the parent with the current value
      setIsEventLocked(true); // Lock the event after confirming
      setError(""); // Clear any existing error
    } else {
      setError("ID de evento incorreta. Tente novamente."); // Show error message if no event is found
    }
  };

  const handleRetry = () => {
    setError(""); // Clear error
    setInputValue(""); // Reset input field
  };

  return (
    <div className="max-w-3xl mx-auto text-center items-center">
      {isEventLocked ? (
        <div className="w-full flex flex-col items-center justify-center gap-2">
          <CheckCircleIcon className="text-green-600 w-16 h-16 mb-2" />
          <p className="text-green-600 text-md">
            validando para <span className="font-semibold">{event?.name}</span>
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl text-white font-bold text-center mb-5">
            Insira a ID do Evento
          </h1>
          <div>
            <input
              type="string"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="ID do evento"
              style={{
                padding: "10px",
                fontSize: "16px",
                marginRight: "10px",
                width: "180px",
              }}
              className="bg-gray-900 bg-opacity-40 border-2 rounded-full text-white"
            />
            <button
              onClick={handleConfirm}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              className="bg-rose-800 text-white px-4 py-2 rounded-full hover:bg-rose-900 transition-colors"
            >
              <Check />
            </button>
          </div>
          {error && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <XCircleIcon className="text-rose-700 w-8 h-8" />
              <p className="text-rose-700">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 bg-rose-700 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventId;
