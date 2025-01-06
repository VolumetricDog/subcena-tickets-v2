"use client";

import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { CalendarDays, MapPin } from "lucide-react";

import { useRouter } from "next/navigation";
import { useStorageUrl } from "@/lib/utils";
import Image from "next/image";

export default function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });

  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  return (
    <div
      className={`bg-white h-full overflow-hidden relative ${
        isPastEvent ? "opacity-75 hover:opacity-100" : ""
      }`}
    >
      {/* Event Image */}
      {imageUrl && (
        <div className="absolute top-0 left-0 w-full h-full">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>
      )}

      {/* Gradient Layer constrained to the main div */}
      <div className="opacity-25 absolute inset-0 bg-gradient-to-tr pointer-events-none animate-gradient mix-blend-overlay" />

      {/* Event Details aligned and stretched to cover full height */}
      <div
        className={`absolute bottom-[60%] lg:bottom-[15%] left-[5%] w-full h-full flex flex-col justify-end pt-36 gap-3 items-start p-6 ${
          imageUrl ? "relative z-10" : ""
        }`}
      >
        {/* Event Name */}
        <h2 className="text-base font-semibold text-white">{event.name}</h2>

        {isPastEvent && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
            Past Event
          </span>
        )}

        {/* Event Status for Past Events */}
        {isPastEvent && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Past Event
          </span>
        )}

        {/* Location */}
        <div className="flex items-center text-white">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-xs">{event.location}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-white">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span className="text-xs">
            {new Date(event.eventDate).toLocaleDateString()}{" "}
            {isPastEvent && "(Ended)"}
          </span>
        </div>

        <button
          onClick={() => router.push(`/event/${eventId}`)}
          className="opacity-70 hover:opacity-100 bg-gradient-to-r from-rose-800 to-orange-200 text-sm text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 transition-colors duration-200 shadow-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed z-50"
        >
          saiba mais
        </button>
      </div>
    </div>
  );
}
