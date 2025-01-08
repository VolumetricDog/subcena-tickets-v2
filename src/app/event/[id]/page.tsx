"use client";

import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { CalendarDays, Clock, MapPin, Ticket, Users } from "lucide-react";
import { useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
// import JoinQueue from "@/components/JoinQueue";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useStorageUrl } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import JoinQueue from "@/components/JoinQueue";
import EventPaymentCard from "@/components/EventPaymentCard";

export default function EventPage() {
  const { user } = useUser();
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });
  const availability = useQuery(api.events.getEventAvailability, {
    eventId: params.id as Id<"events">,
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-black bg-opacity-20 rounded-xl shadow-sm overflow-hidden">
          {imageUrl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Event Details */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {event.name}
                  </h1>
                  <p className="text-base text-gray-300">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-200 mb-1">
                      <CalendarDays className="w-5 h-5 mr-2 text-rose-900" />
                      <span className="text-sm font-medium text-rose-900">
                        Data
                      </span>
                    </div>
                    <p className="text-gray-200">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-200 mb-1">
                      <MapPin className="w-5 h-5 mr-2 text-rose-900" />
                      <span className="text-sm font-medium text-rose-900">
                        Localização
                      </span>
                    </div>
                    <p className="text-gray-200">{event.location}</p>
                  </div>

                  <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-200 mb-1">
                      <Clock className="w-5 h-5 mr-2 text-rose-900" />
                      <span className="text-sm font-medium text-rose-900">
                        horário
                      </span>
                    </div>
                    <p className="text-gray-200">
                      {event.eventStartTime} - {event.eventEndTime}
                    </p>
                  </div>

                  <div className="bg-black bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-center text-gray-200 mb-1">
                      <Users className="w-5 h-5 mr-2 text-rose-900" />
                      <span className="text-sm font-medium text-rose-900">
                        Disponíveis
                      </span>
                    </div>
                    <p className="text-gray-200">
                      {availability.totalTickets - availability.purchasedCount}{" "}
                      / {availability.totalTickets} restantes
                    </p>
                  </div>
                </div>

                {/* Additional Event Information */}
                <div className="bg-rose-700 bg-opacity-60 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Informação do Evento
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Por favor, chegar com 30 minutos de antecedência</li>
                    <li>• Tickets não reembolsáveis</li>
                    <li>• Restrição de idade: 18+</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Ticket Purchase Card */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventPaymentCard eventId={params.id as Id<"events">} />

                  {user ? (
                    <JoinQueue
                      eventId={params.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton>
                      <Button className="w-full bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-700 hover:to-rose-900 hover:scale-105 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                        entre para comprar tickets
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
