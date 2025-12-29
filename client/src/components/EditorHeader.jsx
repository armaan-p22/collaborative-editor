import { useState, useEffect, useRef } from 'react'
import CopyButton from './CopyButton'
import Avatars from './Avatars'
import ExportMenu from './ExportMenu'
import ShareModal from './ShareModal'

const EditorHeader = ({ roomID, status, onBack, provider, ydoc, editor }) => {
  const [title, setTitle] = useState("Loading...")
  const [isSaving, setIsSaving] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchTitle = async () => {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      try {
         const res = await fetch('http://localhost:1234/api/documents', {
            headers: { 'x-auth-token': token }
         })
         
         if (res.ok) {
             const data = await res.json()
             const currentDoc = data.find(d => d._id === roomID)
             if (currentDoc) {
                 setTitle(currentDoc.title)
                 document.title = currentDoc.title
             }
         }
      } catch (err) {
         console.error("Error fetching title:", err)
      }
    }

    fetchTitle()
  }, [roomID])

  const saveTitle = async () => {
      if (!title.trim()) return 
      
      setIsSaving(true)
      const token = localStorage.getItem('auth_token')

      try {
          await fetch(`http://localhost:1234/api/documents/update/${roomID}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'x-auth-token': token
              },
              body: JSON.stringify({ title })
          })
          
      } catch (err) {
          console.error("Failed to save title", err)
      } finally {
          setIsSaving(false)
      }
  }

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          e.target.blur() 
      }
  }
  
  return (
    <div className="editor-header flex items-center justify-between mb-4 border-b pb-2">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="text-gray-500 hover:text-black text-sm font-medium transition-colors shrink-0"
        >
          ← Back
        </button>
        
        <div className="flex flex-col">
          <input 
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}    
            onKeyDown={handleKeyDown} 
            placeholder="Untitled Document"
            className="text-xl font-bold text-gray-800 border border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded px-2 py-0.5 -ml-2 transition-colors w-64 truncate bg-transparent placeholder-gray-400"
          />
          <div className="text-xs text-gray-400 pl-1 flex items-center gap-2">
              <span>ID: {roomID.slice(0, 8)}...</span>
              {isSaving && <span className="text-blue-500 animate-pulse">Syncing...</span>}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <ExportMenu editor={editor} title={title} />
           <button
            onClick={() => setShowShare(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1"
           >
            <span>👤+</span> Share
           </button>
           <CopyButton />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <Avatars provider={provider} />

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          status === 'connected' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
        }`}>
          
          <div className={`w-2 h-2 rounded-full ${
            status === 'connected' ? 'bg-green-500' : 'bg-yellow-600'
          }`} />

          <span>
            {status === 'connected' ? 'Saved to Cloud' : 'Working Offline'}
          </span>
          
        </div>
      </div>

      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        roomID={roomID}
      />
    </div>
  )
}

export default EditorHeader