import Chat from './components/Chat'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import UsernameForm from './components/UsernameForm'

function App() {
    return (
        <main className="grid min-h-screen place-items-center">
            <BrowserRouter>
                <Routes>
                    <Route path='chat' element={<Chat />} />
                    <Route path='/' element={<UsernameForm />} />
                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default App
