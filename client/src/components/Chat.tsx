import React, { useEffect } from 'react'
import { useAppContext } from '../context/appContext'
import useLiveScrollingMode from '../hooks/useLiveScrollingMode'
import { MessageModel } from '../utils/models'
import ChatMessage from './ChatMessage'
import ChatPausedAlert from './ChatPausedAlert'
import SendMessageForm from './SendMessageForm'
import { useNavigate } from 'react-router-dom'

const Chat = () => {
    const ctx = useAppContext()
    if (ctx == null) return <div>No context yet</div>
    const { messages, socket, setMessages, connectChat, author } = ctx
    const { chatMessagesBoxRef, isLiveModeEnabled, scrollNewMessages } =
        useLiveScrollingMode<HTMLDivElement>(messages)
    const navigate = useNavigate()

    useEffect(() => {
        if (author === null) {
            navigate('/')
            return
        }
        connectChat()
    }, [])

    useEffect(() => {
        if (socket === null) return
        socket.on('load-chat', (data) => {
            const oldChat = data.map((item: any) => {
                const { content, rgbColor, userName } = item
                return {
                    author: {
                        rgbColor,
                        userName,
                    },
                    content,
                }
            })
            setMessages([...oldChat])
        })
        socket.on('joined', (data) => {
            const { author, content } = data
            setMessages((prev) => [...prev, { author, content }])
        })
        socket.on('new-message', (data) => {
            const { author, content } = data
            setMessages((prev) => [...prev, { author, content }])
        })
        socket.emit('join', { userName: author?.userName })

        return () => {
            socket.off('new-message')
            socket.off('load-chat')
            socket.off('joined')
        }
    }, [socket])

    return (
        <div className="relative w-full max-w-[550px] px-4 py-3 rounded-lg bg-slate-900 opacity-80">
            <MessagesBox ref={chatMessagesBoxRef} messages={messages} />
            {!isLiveModeEnabled && (
                <ChatPausedAlert
                    onClick={scrollNewMessages}
                    className="absolute inset-x-0 bottom-28 mx-auto"
                />
            )}
            <SendMessageForm className="mt-4" />
        </div>
    )
}

const MessagesBox = React.forwardRef<
    HTMLDivElement,
    { messages: MessageModel[] }
>(({ messages }, ref) => {
    const MessageList = messages.map((message, index) => (
        <ChatMessage key={index} className="mb-1" message={message} />
    ))

    return (
        <div ref={ref} className="h-[70vh] overflow-auto">
            {MessageList}
        </div>
    )
})

export default Chat
