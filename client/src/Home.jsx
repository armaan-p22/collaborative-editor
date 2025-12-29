import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config';

export default function Home({ user, onLogout }) {
    const navigate = useNavigate();
    const [recentDocs, setRecentDocs] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        document.title = 'Docs Clone'
        const fetchDocuments = async() => {
            const token = localStorage.getItem('auth_token')
            if (!token) return

            try {
                const res = await fetch(`${API_URL}/api/documents`, {
                    method: 'GET',
                    headers: {
                        'x-auth-token': token   
                    }
                })

                if (!res.ok) throw new Error('Failed to fetch docs')
                
                const data = await res.json()
                setRecentDocs(data)         

            } catch(err) {
                console.error("Error fetching docs:", err)
            }
        }

        fetchDocuments()
    }, [])
    
    const createNewDoc = async () => {
        const token = localStorage.getItem('auth_token')
        
        try {
            const res = await fetch(`${API_URL}/api/documents/create`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                }
            })

            if (!res.ok) throw new Error('Failed to create doc')
            
            const newDoc = await res.json()
            navigate(`/documents/${newDoc._id}`)
        } catch(err) {
            setError("Could not create document. Try again.")
        }
    }

    const filteredDocs = recentDocs.filter(doc => { 
        const title = doc.title || 'Untitled'
        return title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📝</span>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Docs Clone
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                                <span className="text-xs text-gray-500">Free Plan</span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <button 
                                onClick={onLogout}
                                className="ml-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="mb-10">
                    <button
                        onClick={createNewDoc}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                    >
                        <span className="text-xl font-bold">+</span>
                        <span>Create New Document</span>
                    </button>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Recent Documents</h2>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search by title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 w-full sm:w-64 transition-all"
                        />
                        <span className="absolute left-3.5 top-2.5 text-gray-400">🔍</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                            <div
                                key={doc._id}
                                onClick={() => navigate(`/documents/${doc._id}`)}
                                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between h-48 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="p-2 bg-blue-50 rounded-lg text-2xl">📄</div>
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-lg truncate mb-1 group-hover:text-blue-600 transition-colors">
                                        {doc.title || 'Untitled'}
                                    </h3>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-auto">
                                    <span className="text-xs text-gray-500">
                                        Last opened: {new Date(doc.lastAccessed).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        →
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white rounded-xl border-2 border-dashed border-gray-200">
                            <div className="text-4xl mb-4">📭</div>
                            <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
                            <p className="text-gray-500">Create a new one to get started!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}