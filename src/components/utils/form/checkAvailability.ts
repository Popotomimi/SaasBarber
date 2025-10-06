import Cliente from "@/interfaces/Cliente";
import { services } from "@/db/services";
import calculateEndTime from "../agenda/calculateEndTime";

export const checkAvailability = (
  clientes: Cliente[],
  date: string,
  time: string,
  service: string,
  selectedBarber: string
): string | null => {
  const selectedService = services.find((srv) => srv.name === service);
  if (!selectedService) return null;

  const [startHour, startMinute] = time.split(":").map(Number);
  const startTotalMinutes = startHour * 60 + startMinute;
  const newEndTotalMinutes = startTotalMinutes + selectedService.duration;

  for (const cliente of clientes) {
    if (cliente.barber !== selectedBarber || cliente.date !== date) continue;

    const existingService = services.find(
      (srv) => srv.name === cliente.service
    );
    if (!existingService) continue;

    const [existingStartHour, existingStartMinute] = cliente.time
      .split(":")
      .map(Number);
    const existingStartTotalMinutes =
      existingStartHour * 60 + existingStartMinute;
    const existingEndTotalMinutes =
      existingStartTotalMinutes + existingService.duration;

    const overlap =
      startTotalMinutes < existingEndTotalMinutes &&
      newEndTotalMinutes > existingStartTotalMinutes;

    if (overlap) {
      const conflictStart = cliente.time;
      const conflictEnd = calculateEndTime(
        cliente.time,
        existingService.duration
      );
      return `Conflito com agendamento de ${conflictStart} até ${conflictEnd}. Escolha outro horário.`;
    }
  }

  return null;
};
