import { z } from "zod";

export const scheduleSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  hora: z.string().min(1, "Hora é obrigatória"),
  service: z.string().min(1, "Serviço é obrigatório"),
  barber: z.string().min(1, "Barbeiro é obrigatório"),
  phoneNumber: z
    .string()
    .regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Formato inválido. Use (11) 99999-9999"),
});
