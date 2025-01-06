"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Spinner from "./Spinner";
import { ArrowLeft, ArrowRight, Ticket } from "lucide-react";
import EventCard from "./EventCard";
import EventCardBig from "./EventCardBig";

function EventList() {
  const events = useQuery(api.events.getActiveFutureEvents);

  if (!events || undefined) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const firstFiveEvents = events.length <= 5 ? events : events.slice(0, 4);

  return (
    <div className="w-full h-full relative">
      {/* <div className="w-screen h-screen absolute">
        <EventCardBig key={events[0]._id} eventId={events[0]._id} />
      </div>
      <div className="flex flex-row gap-2 absolute left-[12%] lg:left-[60%] bottom-[25%] lg:bottom-[30%] text-white  z-50">
        <ArrowLeft className="hover:text-rose-950 hover:scale-125 transition duration-500 cursor-pointer" />
        <ArrowRight className="hover:text-rose-950 hover:scale-125 transition duration-500 cursor-pointer" />
      </div>
      <div className="absolute bottom-0">
        {events.length > 0 ? (
          <div
            className="relative mb-16 bottom-0 lg:left-[33%] left-[18%] z-50"
            style={{
              width: "200vw", // Twice the width of the viewport for horizontal overflow
              height: "300px", // Adjust based on the card size
            }}
          >
            {firstFiveEvents.slice(1).map((event, index) => (
              <div
                key={event._id}
                className="absolute hover:scale-110 transition duration-500"
                style={{
                  left: `${index * 100}px`,
                  top: `${index * 10}px`, // Offset each card by 10px vertically
                  zIndex: events.length - index, // Ensure the correct stacking order
                }}
              >
                <EventCard eventId={event._id} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No upcoming events
            </h3>
            <p className="text-gray-600 mt-1">
              Check back later for new events
            </p>
          </div>
        )}
      </div> */}
      <div className="flex flex-wrap justify-center px-3 pt-24 pb-10 gap-2">
        {events.slice(0).map((event, index) => (
          <div
            key={event._id}
            className="scale-95 hover:scale-100 transition duration-500"
          >
            <EventCard eventId={event._id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
