import EventForm from "@/components/EventForm";

export default function NewEventPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-gray-900 bg-opacity-40 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-rose-700 to-rose-900 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Criar novo Evento</h2>
          <p className="text-blue-100 mt-2">
            Cadastre seu evento e comece as vendas
          </p>
        </div>

        <div className="p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}
