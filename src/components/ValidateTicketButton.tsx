"use client";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { CircleCheck } from "lucide-react";

export default function ReleaseTicket({
  ticketId,
  onValidationSuccess, // Callback function from the parent
}: {
  ticketId: Id<"tickets">;
  onValidationSuccess?: () => void; // Optional callback prop
}) {
  // Fetch the current ticket status
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });

  const [isValidating, setIsValidating] = useState(false);
  const validateTicket = useMutation(api.tickets.validateTicketStatus);

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      // Call the mutation to update the ticket status
      await validateTicket({
        ticketId,
      });

      // Notify the parent component on success
      if (onValidationSuccess) {
        onValidationSuccess();
      }
    } catch (error) {
      console.error("Erro validando o ticket:", error);
    } finally {
      setIsValidating(false);
    }
  };

  // Determine the button text and styling based on the status
  const isValidTicket = ticket?.status === "valid";

  return (
    <button
      onClick={handleValidate}
      disabled={isValidating || !isValidTicket} // Disable if already validated or currently validating
      className={`mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg hover:scale-105 transition duration-500
        ${
          isValidTicket
            ? "bg-green-400 text-white cursor-pointer"
            : isValidating
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }
      `}
    >
      <CircleCheck className="w-4 h-4" />
      {isValidTicket
        ? "Validar Ticket!"
        : isValidating
          ? "Validando..."
          : "Ticket Invalido"}
    </button>
  );
}
