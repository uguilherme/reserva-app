import React, { createContext, useContext, useState, ReactNode } from 'react';

type Reserva = {
  id: string;
  disciplina: string;
  horario: string;
  local: string;
};

type ReservaContextType = {
  reservas: Reserva[];
  adicionarReserva: (reserva: Reserva) => void;
};

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

export function ReservaProvider({ children }: { children: ReactNode }) {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  function adicionarReserva(reserva: Reserva) {
    setReservas((prev) => [...prev, reserva]);
  }

  return (
    <ReservaContext.Provider value={{ reservas, adicionarReserva }}>
      {children}
    </ReservaContext.Provider>
  );
}

export function useReserva() {
  const context = useContext(ReservaContext);
  if (!context) throw new Error('useReserva deve ser usado dentro de ReservaProvider');
  return context;
}