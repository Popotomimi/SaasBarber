"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { Plus, Minus, PackageSearch } from "lucide-react";

const productList = [
  "gel",
  "pomadaPequena",
  "pomadaGrande",
  "cervejaCorona",
  "cervejaBudweiser",
  "cocacola",
  "guarana",
  "agua",
];

const StockManage = () => {
  const [stock, setStock] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/stock")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setStock(data[0]);
        }
      });
  }, []);

  const handleChange = (key: string, value: number) => {
    setStock((prev) => ({ ...prev, [key]: value }));
  };

  const handleIncrement = (key: string) => {
    handleChange(key, (stock[key] || 0) + 1);
  };

  const handleDecrement = (key: string) => {
    handleChange(key, Math.max((stock[key] || 0) - 1, 0));
  };

  const handleSubmit = async () => {
    // Filtra apenas os campos com valores numéricos válidos
    const payload: Record<string, number> = {};
    for (const key of productList) {
      const value = stock[key];
      if (typeof value === "number" && !isNaN(value)) {
        payload[key] = value;
      }
    }

    const res = await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success("Estoque atualizado com sucesso!");
    } else {
      toast.error("Erro ao atualizar o estoque.");
    }
  };

  return (
    <Card className="md:max-w-3xl w-[90%] mx-auto mt-10 mb-10 p-6 bg-zinc-800 text-white">
      <CardHeader className="flex items-center gap-2 text-xl font-bold">
        <PackageSearch className="w-6 h-6" />
        Gerenciador de Estoque
      </CardHeader>
      <CardContent className="space-y-6">
        {productList.map((item) => (
          <div
            key={item}
            className="flex flex-col mb-10 md:flex-row md:items-center md:gap-4 gap-2 justify-between">
            <label className="md:w-40 w-full capitalize font-medium">
              {item}
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                onClick={() => handleDecrement(item)}>
                <Minus className="w-4 h-4 text-black" />
              </Button>
              <Input
                type="number"
                value={stock[item] ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  handleChange(item, isNaN(val) ? 0 : val);
                }}
                className="w-20 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                onClick={() => handleIncrement(item)}>
                <Plus className="w-4 h-4 text-black" />
              </Button>
            </div>
          </div>
        ))}
        <Button
          className="w-full mt-6 text-black cursor-pointer bg-white hover:bg-blue-400"
          onClick={handleSubmit}>
          Atualizar Estoque
        </Button>
      </CardContent>
    </Card>
  );
};

export default StockManage;
