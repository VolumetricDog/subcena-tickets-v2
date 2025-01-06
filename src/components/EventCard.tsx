"use client";

import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

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
      onClick={() => router.push(`/event/${eventId}`)}
      className={`bg-white rounded-2xl w-44 h-72 flex-shrink-0 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden relative ${
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
      <div className="absolute opacity-20 hover:opacity-0 inset-0 bg-gradient-to-tr mix-blend-overlay animate-gradient transition" />

      {/* Event Details aligned and stretched to cover full height */}
      <div
        className="absolute bottom-0 w-72"
        style={{
          transform: "rotate(-90deg)", // Rotate the container 90 degrees counterclockwise
          transformOrigin: "top left", // Set the rotation point
          width: "100%", // Ensure the width adjusts after rotation
          // height: "100%", // Ensure the height adjusts after rotation
        }}
      >
        <div
          className={`absolute w-full flex flex-col justify-center gap-2 items-center p-3 ${
            imageUrl ? "relative z-10" : ""
          }`}
        >
          {/* Event Name */}
          <h2 className="text-sm font-semibold text-white">{event.name}</h2>
          {/* <div className=" opacity-5 hover:opacity-80"> */}
          {/* {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-2">
                Past Event
              </span>
            )} */}

          {/* Event Status for Past Events */}
          {/* {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Past Event
              </span>
            )} */}
          {/* <div className="flex flex-row gap-3 opacity-80 hover:opacity-100"> */}
          {/* Location */}
          {/* <div className="flex items-center text-white">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-xs">{event.location}</span>
              </div> */}

          {/* Date */}
          {/* <div className="flex items-center text-white">
                <CalendarDays className="w-4 h-4 mr-2" />
                <span className="text-xs">
                  {new Date(event.eventDate).toLocaleDateString()}{" "}
                  {isPastEvent && "(Ended)"}
                </span>
              </div> */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
