"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Cliente from "@/interfaces/Cliente";
import { barbers } from "@/db/barbers";
import ServiceSelector from "../service-selector/service-selector";

interface Props {
  cliente: Cliente | null;
  formData: {
    name: string;
    time: string;
    service: string;
    duration: number;
    phone: string;
    barber: string;
    price: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<Props["formData"]>>;
  onClose: () => void;
  onSave: () => void;
}

const Modal: React.FC<Props> = ({
  cliente,
  formData,
  setFormData,
  onClose,
  onSave,
}) => {
  return (
    <Dialog open={!!cliente} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nome"
          />

          <Input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />

          <ServiceSelector
            onChange={(selected, totalPrice, totalDuration) => {
              const serviceNames = selected.map((s) => s.name).join(", ");
              setFormData({
                ...formData,
                service: serviceNames,
                price: totalPrice,
                duration: totalDuration,
              });
            }}
          />

          <select
            value={formData.barber}
            onChange={(e) =>
              setFormData({ ...formData, barber: e.target.value })
            }
            className="w-full px-3 py-2 bg-[#2a2a2a] text-white rounded">
            <option value="">Selecione o barbeiro</option>
            {barbers.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>

          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="Telefone"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-blue-400 cursor-pointer hover:bg-blue-600"
            onClick={onSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
