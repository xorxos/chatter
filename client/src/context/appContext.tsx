import React, { useContext, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { faker } from '@faker-js/faker'
import { Author, MessageModel } from '../utils/models'

export interface AppContextInterface {
    author: Author | null
    socket: Socket | null
    messages: MessageModel[]
    setMessages: React.Dispatch<React.SetStateAction<MessageModel[]>>
    sendMessage: (message: MessageModel) => void
    connectChat: () => void
    setUserName: (userName: string) => void
}

interface Props {
    children: React.ReactNode
}

const AppContext = React.createContext<AppContextInterface | null>(null)

const AppProvider: React.FC<Props> = ({ children }) => {
    const [author, setAuthor] = useState<Author | null>(null)
    const [socket, setSocket] = useState<Socket | null>(null)
    const [messages, setMessages] = useState<MessageModel[]>([])

    const generateRandomColor = () => {
        return faker.internet.color(250, 250, 250)
    }
    const connect = () => {
        return io('wss://localhost:5000', {
            reconnectionAttempts: 5,
            rejectUnauthorized: false,
        })
    }
    const connectChat = () => {
        const socket = connect()
        setSocket(socket)
    }

    const setUserName = (userName: string) => {
        setAuthor({ rgbColor: generateRandomColor(), userName })
    }

    const sendMessage = (message: MessageModel) => {
        if (socket === null) return
        socket.emit('message', { ...message })
    }

    return (
        <AppContext.Provider
            value={{
                author,
                socket,
                sendMessage,
                messages,
                setMessages,
                connectChat,
                setUserName,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, useAppContext }
