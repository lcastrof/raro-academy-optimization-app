import React, { createContext, useContext, useEffect, useState } from "react";
import { geraPessoas } from "../helpers/gera-pessoa";
import { ParticipanteChat } from "../types/Participantes";

const geraParticipante = (usuarioAtual = false): ParticipanteChat => ({
  ...geraPessoas(1)[0],
  ativo: true,
  usuarioAtual,
})

export type ChatContextProps = {
  buscaMensagem: string;
  setBuscaMensagem: (buscaMensagem: string) => void;
  participantes: ParticipanteChat[];
  setParticipantes: (participantes: ParticipanteChat[]) => void;
}

const ChatContext = createContext<ChatContextProps>({
  buscaMensagem: '',
  setBuscaMensagem: (_: string) => {},
  participantes: [],
  setParticipantes: (_: ParticipanteChat[]) => {},
});

export const ChatProvider: React.FC = ({ children }) => {
  const [ buscaMensagem, setBuscaMensagem ] = useState<string>('');
  const [ participantes, setParticipantes ] = useState<ParticipanteChat[]>([]);

  useEffect(() => {
    const participantes = [
      geraParticipante(false), // gera dados do usuário convidado.
      geraParticipante(true),  // gera dados do usuário atual.
    ];

    setParticipantes(participantes);
  }, []);
  
  return (
    <ChatContext.Provider
      value={{
        buscaMensagem,
        setBuscaMensagem,
        participantes,
        setParticipantes,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('Você somente pode usar este hook debaixo de um <AuthContextProvider>');
  }

  return context;
};