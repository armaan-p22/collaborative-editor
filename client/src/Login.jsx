import { useState } from 'react'

export default function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (isRegistering && password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login'

        try {
            const res = await fetch(`http://localhost:1234${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: isRegistering ? username : undefined,
                    email,
                    password
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong')
            }

            onLogin(data.user, data.token)
            
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required 
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                            required
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10" 
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {isRegistering && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input 
                                type={showPassword ? "text" : "password"} // Also respects the show/hide toggle
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            setError('')
                            setUsername('') 
                            setEmail('')
                            setPassword('')
                            setConfirmPassword('')
                        }}
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    )
}