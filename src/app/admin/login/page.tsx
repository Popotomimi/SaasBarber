"use client";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      alert("Login inválido");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#222] shadow-[0_0_20px_rgba(255,255,255,0.1)] rounded-lg p-6">
        <div className="flex justify-center mb-6">
          <Image
            src="/img/logo.jpg"
            alt="Logo do Barbeiro"
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>
        <h1 className="text-white text-2xl font-semibold text-center mb-6">
          Login do Barbeiro
        </h1>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-200">
          Entrar
        </button>
      </div>
    </div>
  );
}
