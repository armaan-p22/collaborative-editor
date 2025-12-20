import './App.css'
import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

const ROOM_NAME = 'my-collaborative-doc-v1'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', ROOM_NAME, ydoc)
const persistence = new IndexeddbPersistence(ROOM_NAME, ydoc)

const TiptapEditor = () => {
  const [status, setStatus] = useState('connecting...')

  useEffect(() => {
    const handleStatus = (event) => {
      setStatus(event.status)
    }
    provider.on('status', handleStatus)

    if (provider.wsconnected) {
      setStatus('connected')
    }

    return () => {
      provider.off('status', handleStatus)
    }
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }), // Now uses the correct extension
      CollaborationCursor.configure({              // Now completely safe to use
        provider: provider,
        user: { name: 'User', color: '#f783ac' },
      }),
    ],
  })

  return (
    <div className="editor-card">
      <div className="editor-header">
        <h1 className="editor-title">Docs Clone</h1>
        <span className={`status-badge ${status === 'connected' ? 'status-connected' : 'status-disconnected'}`}>
          {status}
        </span>
      </div>

      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="app-container">
      <TiptapEditor />
      </div>
  )
}