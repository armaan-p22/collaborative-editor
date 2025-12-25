import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

export default function Home() {
    const navigate = useNavigate();
    const [docId, setDocId] = useState('');
    const [recentDocs, setRecentDocs] = useState([])
    const [error, setError] = useState('')

    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const docs = JSON.parse(localStorage.getItem('recent-docs') || '[]')
        setRecentDocs(docs)
    }, [])
    
    const createNewDoc = () => {
        const id = uuidv4();
        navigate(`/documents/${id}`);
    }

    const joinDoc = (e) => {
        e.preventDefault()
        setError('')
        if (!docId.trim()) return

        if (!uuidValidate(docId)) {
        setError('Invalid Document ID. It must be a valid UUID code.')
        return
        }
        navigate(`/documents/${docId}`)
    }

    const filteredDocs = recentDocs.filter(doc => 
        doc.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
            <h1 className="text-4xl font-bold mb-10 text-gray-800"> 📝 Docs Clone</h1>
            
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                
                <button
                    onClick={createNewDoc}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 mb-6"
                >
                    <span>+</span> 📄 Create New Document
                </button>

                <div className="relative flex py-2 items-center mb-4">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">OR JOIN EXISTING</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={joinDoc} className="flex flex-col gap-2"> 
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="documentID"
                            placeholder="Paste Document ID..."
                            value={docId}
                            onChange={(e) => {
                                setDocId(e.target.value)
                                setError('')
                            }}
                            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            }`}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Join
                        </button>
                    </div>
                    
                    {error && <span className="text-red-500 text-sm ml-1">{error}</span>}
                </form>
            </div>

            {recentDocs.length > 0 && (
                <div className="w-full max-w-6xl mt-10">
                    <h2 className="text-lg font-semibold text-gray-600 mb-4 px-2">Recent Documents</h2>
                    
                    <input 
                        type="text"
                        name="search"
                        placeholder="🔍 Search recent docs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 mb-6 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 block"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => navigate(`/documents/${doc.id}`)}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-32 group"
                                >
                                    <div className="overflow-hidden">
                                        <div className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors truncate text-base mb-1" title={doc.title || 'Untitled Document'}>
                                            {doc.title || 'Untitled Document'}
                                        </div>
                                        <div className="text-xs text-gray-400 truncate">
                                            ID: {doc.id.slice(0, 8)}...
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {doc.lastOpened}
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-gray-300 group-hover:text-blue-500 text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-400 text-sm py-4">
                                No documents match your search.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}