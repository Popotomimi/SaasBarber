import Cliente from "../../../interfaces/Cliente";
import extractDuration from "./extractDuration";
import calculateEndTime from "./calculateEndTime";

interface Slot {
  start: string;
  end: string;
  type: "occupied" | "available";
}

const calculateSchedule = (
  clientes: Cliente[],
  startTime: string,
  endTime: string
): Slot[] => {
  const occupiedSlots = clientes.map((cliente) => {
    const duration = extractDuration(cliente.service);
    const slotEndTime = calculateEndTime(cliente.time, duration);
    return {
      start: cliente.time,
      end: slotEndTime,
      type: "occupied" as const,
    };
  });

  occupiedSlots.sort((a, b) => a.start.localeCompare(b.start));

  const schedule: Slot[] = [];
  let lastEndTime = startTime;

  for (const slot of occupiedSlots) {
    if (slot.start > lastEndTime) {
      schedule.push({
        start: lastEndTime,
        end: slot.start,
        type: "available" as const,
      });
    }
    schedule.push(slot);
    lastEndTime = slot.end;
  }

  if (lastEndTime < endTime) {
    schedule.push({
      start: lastEndTime,
      end: endTime,
      type: "available" as const,
    });
  }

  return schedule;
};

export default calculateSchedule;
