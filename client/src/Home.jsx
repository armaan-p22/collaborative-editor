import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function  Home() {
    const navigate = useNavigate();
    const [docId, setDocId] = useState('');

    const createNewDoc = () => {
        const id = uuidv4();
        navigate(`/documents/${id}`);
    }

    const joinDoc = (e) => {
        e.preventDefault()
        if (docId.trim()) {
            navigate(`/documents/${docId}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-500">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Docs Clone</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                <button
                    onClick={createNewDoc}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-6"
                >
                    📄 Create New Document
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <form onSubmit={joinDoc} className="mt-4">
                    <input
                        type="text"
                        placeholder="Enter Document ID"
                        value={docId}
                        onChange={(e) => setDocId(e.target.value)}
                        className="w-full px-4 py-2 border rounded mb-3 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200 transition"
                    >
                        Join Exisiting
                    </button>
                </form>
            </div>
        </div>
    )
}