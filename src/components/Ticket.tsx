"use client";

import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  CalendarDays,
  IdCard,
  MapPin,
  Ticket as TicketIcon,
  User,
} from "lucide-react";
import QRCode from "react-qr-code";
import Spinner from "./Spinner";
import { useStorageUrl } from "@/lib/utils";
import Image from "next/image";
import ValidateTicketButton from "./ValidateTicketButton";

export default function Ticket({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });
  const user = useQuery(api.users.getUserById, {
    userId: ticket?.userId ?? "",
  });
  const imageUrl = useStorageUrl(ticket?.event?.imageStorageId);

  if (!ticket || !ticket.event) return <Spinner />;

  const isPastEvent = ticket.event.eventDate < Date.now();

  const statusText = {
    valid: isPastEvent ? "Expirado" : "Válido",
    used: "Usado",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
  };

  if (!ticket || !ticket.event || !user) {
    return <Spinner />;
  }

  return (
    <div
      className={`bg-gray-900 bg-opacity-40 rounded-xl overflow-hidden shadow-xl border ${ticket.event.is_cancelled ? "border-red-200" : "border-gray-100 border-opacity-0"}`}
    >
      {/* Event Header with Image */}
      <div className="relative">
        {imageUrl && (
          <div className="relative w-full aspect-[21/9] ">
            <Image
              src={imageUrl}
              alt={ticket.event.name}
              fill
              className={`max-w-full h-auto object-cover object-center ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
          </div>
        )}
        <div
          className={`px-6 py-4 ${imageUrl ? "absolute bottom-0 left-0 right-0" : ticket.event.is_cancelled ? "bg-red-600" : "bg-gradient-to-r from-rose-800 to-orange-200"} `}
        >
          <h2
            className={`text-2xl font-bold ${imageUrl || !imageUrl ? "text-white" : "text-black"}`}
          >
            {ticket.event.name}
          </h2>
          {ticket.event.is_cancelled && (
            <p className="text-red-300 mt-1">Este evento foi cancelado</p>
          )}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Event Details */}
          <div className="space-y-4 grid grid-cols-1 justify-center gap-4">
            <div className="flex items-start text-gray-400">
              <CalendarDays
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-rose-600"}`}
              />
              <div>
                <p className="text-sm text-rose-600">Data e hora</p>
                <p className="font-medium">
                  {new Date(ticket.event.eventDate).toLocaleDateString()}
                  {ticket.event.eventStartTime === undefined
                    ? ""
                    : ` . ${ticket.event.eventStartTime} - ${ticket.event.eventEndTime}`}
                </p>
              </div>
            </div>

            <div className="flex items-start text-gray-400">
              <MapPin
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-rose-600"}`}
              />
              <div>
                <p className="text-sm text-rose-600">local</p>
                <p className="font-medium">{ticket.event.location}</p>
              </div>
            </div>

            <div className="flex items-start text-gray-400">
              <User
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-rose-600"}`}
              />
              <div>
                <p className="text-sm text-rose-600">Usuário</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            {/* <div className="flex items-center text-gray-400 break-all">
              <IdCard
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-rose-600"}`}
              />
              <div>
                <p className="text-sm text-gray-400">ID de Usuário</p>
                <p className="font-medium">{user.userId}</p>
              </div>
            </div> */}

            <div className="flex items-start text-gray-400">
              <TicketIcon
                className={`w-5 h-5 mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-rose-600"}`}
              />
              <div>
                <p className="text-sm text-rose-600">Preço do Ticket</p>
                <p className="font-medium">R${ticket.event.price.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex flex-col pt-6 items-center justify-center border-t border-gray-200 md:border-none">
            <div
              className={`bg-gray-100 p-4 rounded-lg ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
            >
              <QRCode value={ticket._id} className="w-48 h-48 z-10 " />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Informações importantes
          </h3>
          {ticket.event.is_cancelled ? (
            <p className="text-sm text-red-600">
              Este evento foi cancelado. O reembolso foi processado.
            </p>
          ) : (
            <ul className="text-sm text-gray-400 space-y-1">
              <li>
                • Por favor, chegar com 30 minutos de antecedência no evento
              </li>
              <li>• Tenha o seu ticket de QR Code pronto</li>
              <li>• Este ticket não é transferível</li>
            </ul>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div
        className={`${ticket.event.is_cancelled ? "bg-red-50" : "bg-gray-50 bg-opacity-10"} px-6 py-4 flex justify-between items-center`}
      >
        <span className="text-sm text-gray-500">
          Data da Compra: {new Date(ticket.purchasedAt).toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${ticket.event.is_cancelled ? "text-red-600" : "text-blue-600"}`}
        >
          {ticket.event.is_cancelled ? "Cancelado" : statusText[ticket.status]}
        </span>
      </div>
    </div>
  );
}
