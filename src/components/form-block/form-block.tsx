"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { barbers } from "@/db/barbers";
import { toast } from "react-toastify";

const bloqueioSchema = z.object({
  barber: z.string().min(1, "Escolha um barbeiro"),
  startDate: z.string().min(1, "Informe a data de início"),
  endDate: z.string().min(1, "Informe a data de fim"),
  startTime: z.string().min(1, "Informe a hora de início"),
  endTime: z.string().min(1, "Informe a hora de fim"),
  motivo: z.string().min(1, "Informe o motivo"),
});

type BloqueioFormData = z.infer<typeof bloqueioSchema>;

const FormBlock = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const form = useForm<BloqueioFormData>({
    resolver: zodResolver(bloqueioSchema),
    defaultValues: {
      barber: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      motivo: "",
    },
  });

  const onSubmit = async (data: BloqueioFormData) => {
    setIsButtonDisabled(true);
    try {
      const res = await fetch("/api/bloqueio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.error || "Erro ao criar bloqueio");
      } else {
        toast.success("Bloqueio criado com sucesso!");
        form.reset();
      }
    } catch (err) {
      toast.error("Erro inesperado ao enviar o formulário.");
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <section id="block" className="w-full px-6 py-12 flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-xl bg-[#1a1a1a] p-8 rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-red-400 text-center">
            Bloquear Agenda
          </h2>

          <FormField
            control={form.control}
            name="barber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Barbeiro
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition">
                      <SelectValue placeholder="Escolha o barbeiro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a1a1a] text-white">
                    {barbers.map((barber) => (
                      <SelectItem
                        key={barber.name}
                        value={barber.name}
                        className="hover:bg-[#333] cursor-pointer">
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Data de início
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Data de fim
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Hora de início
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Hora de fim
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">Motivo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Motivo do bloqueio"
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full cursor-pointer font-semibold py-3 rounded-md transition ${
              isButtonDisabled
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-white text-black hover:bg-red-400"
            }`}>
            {isButtonDisabled ? "Aguarde..." : "Bloquear"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default FormBlock;
