"use client";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";

export default function TicketCard({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });

  if (!ticket || !ticket.event) return <Spinner />;

  const isPastEvent = ticket.event.eventDate < Date.now();

  const statusColors = {
    valid: isPastEvent
      ? "bg-gray-50 text-gray-600 border-gray-200"
      : "bg-green-50 text-green-700 border-green-100",
    used: "bg-gray-50 text-gray-600 border-gray-200",
    refunded: "bg-red-50 text-red-700 border-red-100",
    cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  const statusText = {
    valid: isPastEvent ? "Expirado" : "Válido",
    used: "Usado",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
  };

  return (
    <Link
      href={`/tickets/${ticketId}`}
      className={`block bg-gray-400 bg-opacity-40 rounded-lg shadow-md hover:shadow-lg scale-95 hover:scale-100 transition-all duration-200 border ${
        ticket.event.is_cancelled
          ? "border-red-200"
          : "border-gray-100 border-opacity-0"
      } overflow-hidden ${isPastEvent ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white hover:text-orange-300 transition duration-500">
              {ticket.event.name}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              Comprado em {new Date(ticket.purchasedAt).toLocaleDateString()}
            </p>
            {ticket.event.is_cancelled && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Evento cancelado
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                ticket.event.is_cancelled
                  ? "bg-red-50 text-red-700 border-red-100"
                  : statusColors[ticket.status]
              }`}
            >
              {ticket.event.is_cancelled
                ? "Cancelado"
                : statusText[ticket.status]}
            </span>
            {isPastEvent && !ticket.event.is_cancelled && (
              <span className="flex items-center gap-1 text-xs text-gray-300">
                <Clock className="w-3 h-3" />
                Evento Passado
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-gray-200">
            <CalendarDays
              className={`w-4 h-4 mr-2 ${ticket.event.is_cancelled ? "text-red-600" : ""}`}
            />
            <span className="text-sm">
              {new Date(ticket.event.eventDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center text-gray-200">
            <MapPin
              className={`w-4 h-4 mr-2 ${ticket.event.is_cancelled ? "text-red-600" : ""}`}
            />
            <span className="text-sm">{ticket.event.location}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span
            className={`font-medium ${
              ticket.event.is_cancelled
                ? "text-red-600"
                : isPastEvent
                  ? "text-gray-600"
                  : "text-orange-300"
            }`}
          >
            R${ticket.event.price.toFixed(2)}
          </span>
          <span className="text-gray-600 flex items-center">
            Veja o Ticket <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}
