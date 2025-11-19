import { useEffect, useState } from "react";
import { services } from "@/db/services";
import { combos } from "@/db/combos";
import { additionalServices } from "@/db/additional";
import { chemistry } from "@/db/chemistry";

interface Service {
  name: string;
  price: number;
  duration: number;
}

interface Props {
  onChange: (
    selected: Service[],
    totalPrice: number,
    totalDuration: number
  ) => void;
  resetTrigger?: number;
}

const ServiceSelector = ({ onChange, resetTrigger }: Props) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [mode, setMode] = useState<"combo" | "chemistry" | null>(null);

  useEffect(() => {
    if (resetTrigger !== undefined) {
      setSelectedServices([]);
      setMode(null);
    }
  }, [resetTrigger]);

  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.name === service.name);
    const updated = isSelected
      ? selectedServices.filter((s) => s.name !== service.name)
      : [...selectedServices, service];
    setSelectedServices(updated);
  };

  useEffect(() => {
    const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
    const totalDuration = selectedServices.reduce(
      (acc, s) => acc + s.duration,
      0
    );
    if (typeof onChange === "function") {
      onChange(selectedServices, totalPrice, totalDuration);
    }
  }, [selectedServices]);

  const renderOptions = (title: string, list: Service[]) => (
    <>
      <h3 className="text-lg font-semibold text-white mt-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {list.map((service) => (
          <label
            key={service.name}
            className="flex items-center gap-2 bg-[#222] text-white p-3 rounded-md cursor-pointer hover:bg-[#333]">
            <input
              type="checkbox"
              checked={selectedServices.some((s) => s.name === service.name)}
              onChange={() => toggleService(service)}
            />
            <span>
              {service.name} — R${service.price.toFixed(2)}
            </span>
          </label>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {!mode && (
        <div className="flex gap-4">
          <button
            onClick={() => setMode("combo")}
            className="bg-blue-400 cursor-pointer text-white px-4 py-2 rounded-md">
            Corte / Combo
          </button>
          <button
            onClick={() => setMode("chemistry")}
            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-md">
            Química + Corte
          </button>
        </div>
      )}

      {mode === "combo" && (
        <>
          {renderOptions("Combos", combos)}
          {renderOptions("Serviços", services)}
          {selectedServices.some((s) =>
            services.some((base) => base.name === s.name)
          ) && renderOptions("Adicionais", additionalServices)}
        </>
      )}

      {mode === "chemistry" && (
        <>
          {renderOptions("Químicas + Corte", chemistry)}
          {selectedServices.some((s) =>
            chemistry.some((q) => q.name === s.name)
          ) && renderOptions("Adicionais", additionalServices)}
        </>
      )}
    </div>
  );
};

export default ServiceSelector;
