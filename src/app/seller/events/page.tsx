import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SellerEventList from "@/components/SellerEventList";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export default async function SellerEventsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-900 bg-opacity-40 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/seller"
                className="text-white hover:text-rose-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">meus eventos</h1>
                <p className="mt-1 text-gray-400">
                  gerencie seus eventos e acompanhe suas vendas
                </p>
              </div>
            </div>
            <Link
              href="/seller/new-event"
              className="bg-gradient-to-r from-rose-800 to-orange-200 text-base text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 shadow-md flex items-center gap-4 justify-center disabled:bg-gray-400 disabled:cursor-not-allowed z-50 hover:scale-105 transition duration-500"
            >
              <Plus className="w-5 h-5" />
              criar evento
            </Link>
          </div>
        </div>

        {/* Event List */}
        <div className="bg-gray-900 bg-opacity-40 rounded-xl shadow-sm  p-6">
          <SellerEventList />
        </div>
      </div>
    </div>
  );
}
