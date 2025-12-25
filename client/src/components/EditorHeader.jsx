import { useState, useEffect, useRef } from 'react'
import CopyButton from './CopyButton'
import Avatars from './Avatars'

const EditorHeader = ({ roomID, status, onBack, provider, ydoc }) => {
  const [title, setTitle] = useState("Loading...")
  const inputRef = useRef(null)

  useEffect(() => {
    if (!ydoc || !provider) return

    const metaMap = ydoc.getMap('meta')
    
    const updateTitle = () => {
      const remoteTitle = metaMap.get('title')
      if (remoteTitle) {
        setTitle(remoteTitle)
        document.title = remoteTitle
      }
    }

    metaMap.observe(updateTitle)

    const handleSync = (isSynced) => {
      if (isSynced) {
        const remoteTitle = metaMap.get('title')

        if (remoteTitle) {
          setTitle(remoteTitle)
        }
        else {
          metaMap.set('title', 'Untitled Document')
          setTitle('Untitled Document')
        }
      }
    }

    if (provider.synced) {
      handleSync(true)
    }
    else {
      provider.on('synced', handleSync)
    }

    return () => {
      metaMap.unobserve(updateTitle)
      provider.off('synced', handleSync)
    }
  }, [ydoc, provider])

  const handleRename = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    if (ydoc) {
      ydoc.getMap('meta').set('title', newTitle)
    }

    updateRecentDocs(roomID, newTitle)
  }

  const updateRecentDocs = (id, newTitle) => {
    const docs = JSON.parse(localStorage.getItem('recent-docs') || '[]')
    const index = docs.findIndex(d => d.id == id)

    if (index !== -1) {
      docs[index].title = newTitle
      docs[index].lastOpened = new Date().toLocaleString()
      localStorage.setItem('recent-docs', JSON.stringify(docs))
    }
  }
  
  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div className="flex items-center gap-4 overflow-hidden">
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
            onChange={handleRename}
            placeholder="Untitled Document"
            className="text-xl font-bold text-gray-800 border border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none rounded px-2 py-0.5 -ml-2 transition-colors w-64 truncate bg-transparent placeholder-gray-400"
          />
          <div className="text-xs text-gray-400 pl-1">
             ID: {roomID.slice(0, 8)}...
          </div>
        </div>

        <CopyButton />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <Avatars provider={provider} />

        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          status === 'connected' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {status}
        </span>
      </div>
    </div>
  )
}

export default EditorHeader