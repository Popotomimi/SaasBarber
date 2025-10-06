import Cliente from "@/interfaces/Cliente";

export const fetchClientes = async (): Promise<Cliente[]> => {
  try {
    const res = await fetch("/api/cliente");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};
