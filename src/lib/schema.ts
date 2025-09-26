import { z } from "zod";

export const scheduleSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido"),
  date: z.string().min(1, "Data obrigatória"),
  hora: z.string().min(1, "Hora obrigatória"),
  service: z.string().min(1, "Serviço obrigatório"),
  barber: z.string().min(1, "Barbeiro obrigatório"),
  phoneNumber: z.string().min(10, "Número inválido"),
});
