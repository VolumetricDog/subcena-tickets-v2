import SellerDashboard from "@/components/SellerDashboard";
import { auth } from "@clerk/nextjs/server";
import { TicketCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <SellerDashboard />
      <div className="max-w-3xl w-full mx-auto p-6">
        <div className="bg-gray-900  bg-opacity-40 rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-rose-800 to-orange-200 px-6 py-8 text-white">
            <h2 className="text-2xl font-bold">Validador de tickets</h2>
            <p className="text-gray-200 mt-2">
              não deixe nenhum penetra entrar
            </p>
          </div>
          <div className="p-6">
            <Link
              href="/seller/validate-ticket"
              className="flex items-center w-full justify-center gap-2 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500"
            >
              <TicketCheck className="w-5 h-5" />
              Validar Tickets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
