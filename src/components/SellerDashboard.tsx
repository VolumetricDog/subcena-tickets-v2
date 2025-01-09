"use client";
import { createStripeConnectAccountLink } from "../../actions/createStripeConnectAccountLink";
import { createStripeConnectCustomer } from "../../actions/createStripeConnectCostumer";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { createStripeConnectLoginLink } from "../../actions/createStripeConnectLoginLink";
import { getStripeConnectAccountStatus } from "../../actions/getStripeConnectAccountStatus.ts";
import type { AccountStatus } from "../../actions/getStripeConnectAccountStatus.ts";
import { CalendarDays, Cog, Plus, TicketCheck } from "lucide-react";
import Link from "next/link";
import Spinner from "./Spinner";

export default function SellerDashboard() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const [accountLinkCreatePending, setAccountLinkCreatePending] =
    useState(false);
  const [error, setError] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(
    null
  );
  const router = useRouter();
  const { user } = useUser();
  const stripeConnectId = useQuery(api.users.getUsersStripeConnectId, {
    userId: user?.id || "",
  });

  const isReadyToAcceptPayments =
    accountStatus?.isActive && accountStatus?.payoutsEnabled;

  useEffect(() => {
    if (stripeConnectId) {
      fetchAccountStatus();
    }
  }, [stripeConnectId]);

  if (stripeConnectId === undefined) {
    return <Spinner />;
  }

  const handleManageAccount = async () => {
    try {
      if (stripeConnectId && accountStatus?.isActive) {
        const loginUrl = await createStripeConnectLoginLink(stripeConnectId);
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error("Error accessing Stripe Connect portal:", error);
      setError(true);
    }
  };

  const fetchAccountStatus = async () => {
    if (stripeConnectId) {
      try {
        const status = await getStripeConnectAccountStatus(stripeConnectId);
        setAccountStatus(status);
      } catch (error) {
        console.error("Error fetching account status:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-6">
      <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-rose-800 to-orange-200 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Painel de Vendas</h2>
          <p className="text-gray-200 mt-2">Gerencie o seu perfil de vendas</p>
        </div>

        {/* Main Content */}
        {isReadyToAcceptPayments && (
          <>
            <div className=" p-8 rounded-lg">
              <h2 className="text-2xl font-semibold text-center text-white mb-6">
                Venda tickets para seu evento
              </h2>
              <p className="text-white text-center mb-8">
                Cadastre seu eventos e comece a vender
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/seller/new-event"
                  className="bg-gradient-to-r w-full from-rose-800 to-orange-200 text-base text-white px-6 py-3 rounded-full font-medium hover:bg-rose-700 shadow-md flex items-center gap-4 justify-center disabled:bg-gray-400 disabled:cursor-not-allowed z-50 hover:scale-105 transition duration-500"
                >
                  <Plus className="w-5 h-5" />
                  Criar Evento
                </Link>
                <Link
                  href="/seller/events"
                  className="flex items-center w-full justify-center gap-2 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500"
                >
                  <CalendarDays className="w-5 h-5" />
                  Ver meus Eventos
                </Link>
              </div>
            </div>

            <hr className="my-8" />
          </>
        )}

        <div className="p-6">
          {/* Account Creation Section */}
          {!stripeConnectId && !accountCreatePending && (
            <div className="text-center py-8">
              <h3 className="text-xl text-white font-semibold mb-4">
                Comece a receber pagamentos
              </h3>
              <p className="text-gray-200 mb-6">
                Crie sua conta de vendas para começar a receber pagamentos pelo
                Stripe
              </p>
              <button
                onClick={async () => {
                  setAccountCreatePending(true);
                  setError(false);
                  try {
                    await createStripeConnectCustomer();
                    setAccountCreatePending(false);
                  } catch (error) {
                    console.error(
                      "Error creating Stripe Connect customer:",
                      error
                    );
                    setError(true);
                    setAccountCreatePending(false);
                  }
                }}
                className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Criar conta de Vendas
              </button>
            </div>
          )}

          {/* Account Status Section */}
          {stripeConnectId && accountStatus && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Status Card */}
                <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg shadow-sm text-white">
                  <h3 className="text-sm font-medium text-gray-500">
                    status da conta
                  </h3>
                  <div className="mt-2 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        accountStatus.isActive
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="text-lg font-semibold">
                      {accountStatus.isActive
                        ? "ativa"
                        : "configuração pendente"}
                    </span>
                  </div>
                </div>

                {/* Payments Status Card */}
                <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg shadow-sm text-white">
                  <h3 className="text-sm font-medium text-gray-500">
                    pagamentos
                  </h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.chargesEnabled
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.chargesEnabled
                          ? "pode receber pagamentos"
                          : "ainda não aceita pagamentos"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className={`w-5 h-5 ${
                          accountStatus.payoutsEnabled
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">
                        {accountStatus.payoutsEnabled
                          ? "pode realizar saque"
                          : "ainda não pode realizar saque"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              {accountStatus.requiresInformation && (
                <div className="bg-gray-800 bg-opacity-40 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-yellow-800 mb-3">
                    Informação necessária
                  </h3>
                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div className="mb-3">
                      <p className="text-yellow-800 font-medium mb-2">
                        Ação requerida:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.currently_due.map((req) => (
                          <li key={req}>{req.replace(/_/g, " ")}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {accountStatus.requirements.eventually_due.length > 0 && (
                    <div>
                      <p className="text-yellow-800 font-medium mb-2">
                        eventualmente necessário:
                      </p>
                      <ul className="list-disc pl-5 text-yellow-700 text-sm">
                        {accountStatus.requirements.eventually_due.map(
                          (req) => (
                            <li key={req}>{req.replace(/_/g, " ")}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {/* Only show Add Information button if there are requirements */}
                  {!accountLinkCreatePending && (
                    <button
                      onClick={async () => {
                        setAccountLinkCreatePending(true);
                        setError(false);
                        try {
                          const { url } =
                            await createStripeConnectAccountLink(
                              stripeConnectId
                            );
                          router.push(url);
                        } catch (error) {
                          console.error(
                            "Error creating Stripe Connect account link:",
                            error
                          );
                          setError(true);
                        }
                        setAccountLinkCreatePending(false);
                      }}
                      className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      completar requerimentos
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                {accountStatus.isActive && (
                  <button
                    onClick={handleManageAccount}
                    className="bg-gradient-to-r from-rose-800 to-orange-200 text-base text-white w-full px-6 py-3 rounded-full font-medium hover:bg-rose-700 shadow-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed z-50 hover:scale-105 transition duration-500"
                  >
                    <Cog className="w-4 h-4 mr-2" />
                    painel de pagamentos
                  </button>
                )}
                <button
                  onClick={fetchAccountStatus}
                  className="flex items-center justify-center w-full gap-2 bg-gray-700 bg-opacity-40 px-4 py-2 rounded-lg shadow-sm text-white hover:scale-105 transition duration-500"
                >
                  atualizar status
                </button>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg">
                  Unable to access Stripe dashboard. Please complete all
                  requirements first.
                </div>
              )}
            </div>
          )}

          {/* Loading States */}
          {accountCreatePending && (
            <div className="text-center py-4 text-gray-600">
              Creating your seller account...
            </div>
          )}
          {accountLinkCreatePending && (
            <div className="text-center py-4 text-gray-600">
              Preparing account setup...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
