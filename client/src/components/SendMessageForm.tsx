import { useAppContext } from '../context/appContext'
import React, { useState } from 'react'

type SendMessageFormProps = {
    className?: string
}

const SendMessageForm = ({className}: SendMessageFormProps) => {
    const ctx = useAppContext()

    // have to check if context is null before destructuring
    if (ctx == null) return <div>No context yet</div>
    const { author, sendMessage } = ctx

    const [message, setMessage] = useState<string>('')
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (author === null || message === '') return
        sendMessage({ author, content: message })
        setMessage('')
    }

    return (
        <form className={className} onSubmit={handleSubmit}>
            <input
                type="text"
                className="w-full p-2 rounded bg-slate-700 focus:outline-none focus:ring-blue-500 focus:ring-2"
                placeholder="Send a chat message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button
                className="bg-blue-600 p-2 float-right mt-2 rounded-md"
                type="submit"
            >
                Send
            </button>
        </form>
    )
}
export default SendMessageForm
