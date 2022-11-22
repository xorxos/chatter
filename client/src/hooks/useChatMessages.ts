import { useState } from 'react'
import { MessageModel } from '../utils/models'
import { generateFakeMessage } from '../utils/helpers'

const welcomeMessage: MessageModel = {
    author: {
        rgbColor: 'darkorchid',
        userName: 'WelcomeBot',
    },
    content: 'Welcome to Chatter!',
}

// generate fake messages
const fakeMessages: MessageModel[] = Array(5)
    .fill(null)
    .map(() => generateFakeMessage())

export default function useChatMessages() {
    const [messages, setMessages] = useState<MessageModel[]>([
        welcomeMessage,
        ...fakeMessages,
    ])

    return {
        messages,
    }
}
