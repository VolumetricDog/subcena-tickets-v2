"use client";

import { Check } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface EventIdProps {
  onEventIdChange: (eventId: any) => void; // Prop to notify the parent
}

const EventId: React.FC<EventIdProps> = ({ onEventIdChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [isEventLocked, setIsEventLocked] = useState(false); // State for lock status

  const eventName = api.events;

  const handleConfirm = () => {
    onEventIdChange(inputValue); // Notify the parent with the current value
    setIsEventLocked(true); // Lock the event after confirming
  };

  return (
    <div className="max-w-3xl mx-auto text-center items-center">
      {isEventLocked ? (
        <p className="text-green-600 text-xl font-bold">
          Id de evento inserida com sucesso!
        </p>
      ) : (
        <>
          <h1 className="text-2xl text-white font-bold text-center mb-5">
            Insira a Id do Evento
          </h1>
          <div>
            <input
              type="string"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Id do evento"
              style={{
                padding: "10px",
                fontSize: "16px",
                marginRight: "10px",
                width: "180px",
              }}
              className="bg-gray-900 bg-opacity-40border-2 rounded-full text-white"
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
        </>
      )}
    </div>
  );
};

export default EventId;
