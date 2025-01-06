"use client";

import { Doc } from "../../convex/_generated/dataModel";
import { Metrics } from "../../convex/events";
import { useStorageUrl } from "@/lib/utils";
import {
  CalendarDays,
  Edit,
  Ticket,
  Ban,
  Banknote,
  InfoIcon,
  Key,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CancelEventButton from "@/components/CancelEventButton";
import { useRouter } from "next/navigation";

function SellerEventCard({
  event,
}: {
  event: Doc<"events"> & {
    metrics: Metrics;
  };
}) {
  const router = useRouter();
  const imageUrl = useStorageUrl(event.imageStorageId);
  const isPastEvent = event.eventDate < Date.now();

  return (
    <div
      onClick={() => router.push(`/event/${event._id}`)}
      className={`bg-gray-800 cursor-pointer bg-opacity-40 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition duration-500 border ${event.is_cancelled ? "border-red-200" : "border-gray-200 border-opacity-0"} overflow-hidden`}
    >
      <div className="p-6">
        <div className="flex flex-wrap md:flex-nowrap items-start gap-6">
          {/* Event Image */}
          {imageUrl && (
            <div className="relative w-full md:w-40 h-40 rounded-lg overflow-hidden shrink-0">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap md:flex-none items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {event.name}
                </h3>
                <p className="mt-1 text-gray-400">{event.description}</p>
                {event.is_cancelled && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <Ban className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      evento cancelado & reembolsado
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!isPastEvent && !event.is_cancelled && (
                  <>
                    <Link
                      href={`/seller/events/${event._id}/edit`}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700  bg-opacity-40 rounded-lg hover:scale-105 transition duration-500"
                    >
                      <Edit className="w-4 h-4" />
                      editar
                    </Link>
                    <CancelEventButton eventId={event._id} />
                  </>
                )}
              </div>
              <div
                className="flex gap-2 justify-center p-3 w-full bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-gray-400 hover:scale-105 transition duration-500"
                onClick={() => {
                  const code = event._id; // Replace with the event code
                  navigator.clipboard
                    .writeText(code)
                    .then(() => {
                      alert("Código copiado para a área de transferência!");
                    })
                    .catch((err) => {
                      console.error("Erro ao copiar código: ", err);
                    });
                }}
              >
                <Key className="w-4 h-4" />
                <span className="text-sm font-medium cursor-pointer">
                  copiar código do evento
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Ticket className="w-4 h-4 hidden lg:block" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "reembolsados" : "vendidos"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-white">
                  {event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm text-gray-500 font-normal">
                        {" "}
                        reembolsado
                      </span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm text-white font-normal">
                        /{event.totalTickets}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="p-3 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Banknote className="w-4 h-4 hidden lg:block" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "quantia reembolsada" : "receita"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-white">
                  R$
                  {event.is_cancelled
                    ? event.metrics.refundedTickets * event.price
                    : event.metrics.revenue}
                </p>
              </div>

              <div className="p-3 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <CalendarDays className="w-4 h-4 hidden lg:block" />
                  <span className="text-sm font-medium">data</span>
                </div>
                <p className="text-sm font-medium text-gwhite">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>

              <div className="p-3 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <InfoIcon className="w-4 h-4 hidden lg:block" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-sm font-medium text-white">
                  {event.is_cancelled
                    ? "cancelado"
                    : isPastEvent
                      ? "passado"
                      : "ativo"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerEventCard;
