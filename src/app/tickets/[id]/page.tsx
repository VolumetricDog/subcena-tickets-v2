"use client";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import Ticket from "@/components/Ticket";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Spinner from "@/components/Spinner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function TicketPage() {
  const params = useParams();
  const { user } = useUser();
  const ticket = useQuery(api.tickets.getTicketWithDetails, {
    ticketId: params.id as Id<"tickets">,
  });

  // Handle early redirects
  if (!user) {
    redirect("/");
    return null;
  }

  if (!ticket || ticket.userId !== user.id) {
    redirect("/tickets");
    return null;
  }

  if (!ticket.event) {
    redirect("/tickets");
    return null;
  }

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

  const handleDownloadPDF = async () => {
    if (!ticket || !ticket.event) {
      console.error("Ticket or event data is missing.");
      return;
    }

    const ticketElement = document.getElementById("ticket-to-download");

    if (ticketElement) {
      // Save original styles
      const originalBackground = ticketElement.style.backgroundColor;
      const originalPadding = ticketElement.style.padding;

      // Temporarily style the ticket element
      ticketElement.style.backgroundColor = "#040612"; // Dark blue background
      ticketElement.style.padding = "20px"; // Padding for visual spacing in DOM

      // Render the ticket content with html2canvas
      const canvas = await html2canvas(ticketElement, { useCORS: true });

      // Get original canvas dimensions
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Convert canvas dimensions to mm (for jsPDF)
      const pxToMm = 0.264583; // 1px = 0.264583mm
      const imgWidth = canvasWidth * pxToMm; // Original width in mm
      const imgHeight = canvasHeight * pxToMm; // Original height in mm

      // Add padding of 15mm to the PDF
      const pdfWidth = imgWidth + 30; // Content width + 15mm padding on each side
      const pdfHeight = imgHeight + 30; // Content height + 15mm padding on each side

      // Create a PDF with calculated dimensions
      const pdf = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);

      // Set background color for the entire PDF
      pdf.setFillColor("#040612");
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

      // Center the image in the PDF with padding
      const imgX = 10; // Left padding
      const imgY = 10; // Top padding

      // Add the image to the PDF, maintaining its aspect ratio
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        imgX,
        imgY,
        imgWidth,
        imgHeight
      );

      // Restore the original styles
      ticketElement.style.backgroundColor = originalBackground;
      ticketElement.style.padding = originalPadding;

      // Save the PDF
      pdf.save(`${ticket.event.name}-ticket.pdf`);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 space-y-8">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/tickets"
              className="flex items-center text-gray-300 hover:text-orange-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Meus Tickets
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Salvar</span>
              </button>
              {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Compartilhar</span>
              </button> */}
            </div>
          </div>

          {/* Event Info Summary */}
          <div
            className={`bg-gray-900 bg-opacity-40 p-6 rounded-lg shadow-md border ${ticket.event.is_cancelled ? "border-red-200" : "border-gray-100 border-opacity-0"}`}
          >
            <h1 className="text-2xl font-bold text-white">
              {ticket.event.name}
            </h1>
            <p className="mt-1 text-gray-400">
              {new Date(ticket.event.eventDate).toLocaleDateString()} at{" "}
              {ticket.event.location}
            </p>
            <div className="mt-4 flex items-center gap-4">
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
              <span className="text-sm text-gray-500">
                Comprado em {new Date(ticket.purchasedAt).toLocaleDateString()}
              </span>
            </div>
            {ticket.event.is_cancelled && (
              <p className="mt-4 text-sm text-red-600">
                Este evento foi cancelado. O reembolso já foi processado.
              </p>
            )}
          </div>
        </div>

        {/* Ticket Component */}
        <div id="ticket-to-download">
          <Ticket ticketId={ticket._id} />
        </div>

        {/* Additional Information */}
        <div
          className={`mt-8 rounded-lg p-4 ${
            ticket.event.is_cancelled
              ? "bg-red-50 bg-opacity-10 border-red-100 border"
              : "bg-orange-50 bg-opacity-10"
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              ticket.event.is_cancelled ? "text-red-300" : "text-rose-300"
            }`}
          >
            Precisa de Ajuda?
          </h3>
          <p
            className={`mt-1 text-sm ${
              ticket.event.is_cancelled ? "text-red-200" : "text-rose-200"
            }`}
          >
            {ticket.event.is_cancelled
              ? "Para perguntas sobre cancelamentos e reembolsos, favor entrar em contato com nosso time de suporte em contato@subcena.com"
              : "Se estiver tentando qualquer problema com seu ticket, favor entrar em contato com nosso time de suporte em contato@subcena.com"}
          </p>
        </div>
      </div>
    </div>
  );
}
