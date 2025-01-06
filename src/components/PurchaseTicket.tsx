"use client";

import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Ticket } from "lucide-react";
import ReleaseTicket from "./ReleaseTicket";
import { createStripeCheckoutSession } from "../../actions/createStripeCheckoutSession";

export default function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  const event = useQuery(api.events.getById, { eventId });
  const isEventFree = event?.price === 0;

  // this is the timer for the remaining time
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
            seconds === 1 ? "" : "s"
          }`
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  const purchaseTicketMutation = useMutation(api.events.purchaseFreeTicket);
  // create stripe checkout
  const handlePurchase = async () => {
    if (!user) return;

    interface PurchaseFreeTicketResult {
      ticketId: string; // or whatever type ticketId is, e.g., string
    }

    if (isEventFree) {
      try {
        console.log(isEventFree);
        // Pass a single object containing both userId and eventId
        const result = (await purchaseTicketMutation({
          userId: user?.id ?? "",
          eventId,
        })) as PurchaseFreeTicketResult | null; // Explicitly define the possible result type (null)
        // Check if result is not null or undefined
        if (result && result.ticketId) {
          console.log("Free ticket purchase successful:", result);
          router.push(`/success?ticketId=${result.ticketId}`); // Redirect user to a success page
        }
      } catch (error) {
        console.error("Error purchasing free ticket:", error);
        router.push("/error"); // Redirect user to an error page
      }
      return;
    }

    // For paid events, proceed with Stripe checkout
    try {
      setIsLoading(true);
      const { sessionUrl } = await createStripeCheckoutSession({
        eventId,
      });

      if (sessionUrl) {
        router.push(sessionUrl);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-200">
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket reservado
                </h3>
                <p className="text-sm text-gray-500">
                  Expira em {timeRemaining}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              Um ticket foi reservado para você. Complete a compra antes da
              ofertar expirar e garanta seu lugar.
            </div>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isExpired || isLoading}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold shadow-md hover:from-amber-600 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
        >
          {isLoading
            ? "Redirecionando para checkout..."
            : "Adquira seu ticket agora →"}
        </button>

        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
}
