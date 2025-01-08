"use client";

import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { WAITING_LIST_STATUS } from "../../convex/constants";
import Spinner from "./Spinner";
import { Clock, Flame, OctagonXIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConvexError } from "convex/values";

export default function JoinQueue({
  eventId,
  userId,
}: {
  eventId: Id<"events">;
  userId: string;
}) {
  const { toast } = useToast();
  const joinWaitingList = useMutation(api.events.joinWaitingList);
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId,
  });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const event = useQuery(api.events.getById, { eventId });

  const isEventOwner = userId === event?.userId;

  const handleJoinQueue = async () => {
    try {
      const result = await joinWaitingList({ eventId, userId });
      if (result.success) {
        console.log("Entrou na fila de espera com sucesso");
        toast({
          title: result.message,
          duration: 5000,
        });
      }
    } catch (error) {
      if (
        error instanceof ConvexError &&
        error.message.includes("entrou na fila de espera muitas vezes.")
      ) {
        toast({
          variant: "destructive",
          title: "Devagar aí!",
          description: error.data,
          duration: 5000,
        });
      } else {
        console.error("Erro ao entrar na fila de espera:", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Algo deu errado.",
          description: "Falha ao entrar na fila. Tente novamente mais tarde.",
        });
      }
    }
  };

  if (queuePosition === undefined || availability === undefined || !event) {
    return <Spinner />;
  }

  if (userTicket) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  return (
    <div>
      {(!queuePosition ||
        queuePosition.status === WAITING_LIST_STATUS.EXPIRED ||
        (queuePosition.status === WAITING_LIST_STATUS.OFFERED &&
          queuePosition.offerExpiresAt &&
          queuePosition.offerExpiresAt <= Date.now())) && (
        <>
          {isEventOwner ? (
            <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-800 bg-opacity-40 text-gray-400 rounded-lg">
              <OctagonXIcon className="w-5 h-5" />
              <span>
                Você não consegue comprar ingresso para seu próprio evento
              </span>
            </div>
          ) : isPastEvent ? (
            <div className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed">
              <Clock className="w-5 h-5" />
              <span>O evento já acabou</span>
            </div>
          ) : availability.purchasedCount >= availability?.totalTickets ? (
            <div className="text-center p-4">
              <p className="text-lg font-semibold text-red-600">
                Desculpe, esse evento está esgotado.
              </p>
            </div>
          ) : (
            <button
              onClick={handleJoinQueue}
              disabled={isPastEvent || isEventOwner}
              className="w-full bg-gradient-to-r from-rose-800 to-orange-200 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {event.price === 0
                ? "evento gratuito"
                : `R$ ${event.price.toFixed(2)}`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
