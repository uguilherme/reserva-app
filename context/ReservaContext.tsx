import React, { createContext, useContext, useState } from 'react';

type Reserva = {
  id: string;
  disciplina: string;
  curso: string;
  horario: string;
  local: string;
  observacoes?: string;
  // outros campos se necessário
};

type ReservaContextType = {
  reservas: Reserva[];
  adicionarReserva: (reserva: Reserva) => void;
  removerReserva: (id: string) => void;
};

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

export const ReservaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  const adicionarReserva = (reserva: Reserva) => {
    setReservas((prev) => [...prev, reserva]);
  };

  const removerReserva = (id: string) => {
    setReservas((prev) => prev.filter((reserva) => reserva.id !== id));
  };

  return (
    <ReservaContext.Provider value={{ reservas, adicionarReserva, removerReserva }}>
      {children}
    </ReservaContext.Provider>
  );
};

export const useReserva = () => {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error('useReserva deve ser usado dentro de um ReservaProvider');
  }
  return context;
};