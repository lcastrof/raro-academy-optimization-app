import faker from "@faker-js/faker";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Mensagem } from "../types/Mensagem";
import { ParticipanteChat } from "../types/Participantes";
import { useChat } from "./chat.context";


export type ChatMessagesContextProps = {
  mensagens: Mensagem[];
  setMensagens: (mensagens: Mensagem[]) => void;
  adicionaMensagem: (texto: string, participante: ParticipanteChat) => void;
}

const ChatMessagesContext = createContext<ChatMessagesContextProps>({
  mensagens: [],
  setMensagens: (_: Mensagem[]) => {},
  adicionaMensagem: (texto: string, participante: ParticipanteChat) => {},
});

export const ChatMessagesProvider: React.FC = ({ children }) => {
  const [ mensagens, setMensagens ] = useState<Mensagem[]>([]);
  const { participantes } = useChat();

  useEffect(() => {
    // produz uma carga inicial de mensagens.
    // util para testes.
    if(!participantes.length) return;
    Array.from(new Array(100)).forEach(() => {
      const id = faker.datatype.number({ min: 0, max: 1 });
      const autor = participantes[id];
      const texto = faker.lorem.sentence();
      adicionaMensagem(texto, autor);
    });

    // produz novas mensgens em um intervalo regular.
    // util para testes.
    const interval = setInterval(() => {
      const texto = faker.lorem.words(6);
      adicionaMensagem(texto, participantes[0]);
    }, 3000);

    return () => {
      clearInterval(interval);
    }
  }, [participantes]);
  
  const adicionaMensagem = (texto: string, autor: ParticipanteChat) => {
    const mensagem: Mensagem = {
      id: faker.datatype.uuid(),
      texto,
      autor,
      data: new Date(),
      lida: false
    }

    setMensagens(mensagens => [ ...mensagens, mensagem ]);
  };

  return (
    <ChatMessagesContext.Provider
      value={{
        mensagens,
        setMensagens,
        adicionaMensagem,
      }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};

export const useChatMessages = () => {
  const context = useContext(ChatMessagesContext);

  if (!context) {
    throw new Error('Você somente pode usar este hook debaixo de um <AuthContextProvider>');
  }

  return context;
};