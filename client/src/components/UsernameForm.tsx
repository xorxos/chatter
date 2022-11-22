import { useState } from 'react'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'

const UsernameForm = () => {
    const [text, setText] = useState<string>('')
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [alertText, setAlertText] = useState<string>('')
    const ctx = useAppContext()
    const navigate = useNavigate()

    // have to check if context is null before destructuring
    if (ctx == null) return <div>No context yet</div>
    const { setUserName } = ctx

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (text === '') {
            setAlertText('Display name cannot be empty!')
            setShowAlert(true)
            return
        }
        setUserName(text)
        navigate('/chat')
    }

    return (
        <form
            className="p-4 flex flex-col w-full max-w-[550px]"
            onSubmit={(e) => handleSubmit(e)}
        >
            <label>Enter a chat display name</label>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow rounded p-2 mt-4 bg-slate-700 focus:outline-none focus:ring-blue-500 focus:ring-2"
            />
            <button
                type="submit"
                className="bg-blue-600 p-2 mt-4 float-right rounded-md"
            >
                Join
            </button>
            {showAlert && (
                <div className="p-2 mt-4 bg-red-800 rounded-md w-full flex justify-center">
                    <p>{alertText}</p>
                </div>
            )}
        </form>
    )
}
export default UsernameForm
