"use server";

import { getConvexClient } from "@/lib/convex";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export async function validateTicket(ticketId: Id<"tickets">) {
  const convex = getConvexClient();

  // Get ticket details
  const ticket = await convex.query(api.tickets.getTicketWithDetails, {
    ticketId,
  });
  if (!ticket) throw new Error("Ticket not found");

  // Process refunds for each ticket

  try {
    // Update ticket status to refunded
    await convex.mutation(api.tickets.updateTicketStatus, {
      ticketId: ticket._id,
      status: "used",
    });

    return { success: true, ticketId: ticket._id };
  } catch (error) {
    console.error(`Failed to refund ticket ${ticket._id}:`, error);
    return { success: false, ticketId: ticket._id, error };
  }
}
