import { useState } from 'react'

export default function ShareModal({ isOpen, onClose, roomID }) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isError, setIsError] = useState(false)
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleShare = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setIsError(false)

        const token = localStorage.getItem('auth_token')

        try {
            const res = await fetch(`http://localhost:1234/api/documents/share/${roomID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({email})
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            setMessage(data.message)
            setEmail('')

        } catch(err) {
            setIsError(true)
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    X
                </button>

                <h2 className="text-xl font-bold mb-4 text-gray-800">Share Document</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Enter the email address of the user you want to invite. They must have an account.
                </p>

                {message && (
                    <div className={`mb-4 p-2 rounded text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleShare}>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="friend@example.com"
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:border-blue-500" 
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded font-medium text-white transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? 'Inviting...' : 'Invite'}
                    </button>
                </form>
            </div>
        </div>
    )
}