/* Imports */
import './App.css'
import Toolbar from './Toolbar.jsx'
import Home from './Home.jsx'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom'

/* Tiptap & Yjs Imports */
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'

/* Extension Imports */
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { LineHeight } from './extensions/LineHeight'
import { FontSize } from './extensions/FontSize'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'

/* Random User Generator */
const adjectives = ['Happy', 'Cool', 'Swift', 'Chill', 'Brave', 'Smart', 'Wild']
const animals = ['Panda', 'Tiger', 'Eagle', 'Badger', 'Fox', 'Koala', 'Hawk']
const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)]
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16)

const getRandomName = () => {
  return `${getRandomElement(adjectives)} ${getRandomElement(animals)}`
}

/* Main Editor Component */
const TiptapEditor = () => {
  const { id: roomID } = useParams()
  const [status, setStatus] = useState('connecting...')
  const navigate = useNavigate()
  
  const [editorSetup, setEditorSetup] = useState(null)

  /* Setup Yjs Provider & WebSocket connection */
  useEffect(() => {
    /* Create fresh Yjs document and provider */
    const newYdoc = new Y.Doc()
    const newProvider = new WebsocketProvider('ws://localhost:1234', roomID, newYdoc)
    const newPersistence = new IndexeddbPersistence(roomID, newYdoc)

    /* Monitor connection status */
    const handleStatus = (event) => {
      setStatus(event.status)
    }
    newProvider.on('status', handleStatus)

    /* Store instance in state */
    setEditorSetup({ ydoc: newYdoc, provider: newProvider })

    /* Cleanup on unmount */
    return () => {
      newProvider.off('status', handleStatus)
      newProvider.destroy()
      newYdoc.destroy()
    }
  }, [roomID])

  /* Configure Tiptap Editor */
  const editor = useEditor({
    editable: !!editorSetup, // Disable editing until provider is ready
    extensions: [
      StarterKit.configure({ 
        history: false, // Let Yjs handle history
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        }, 
      }),
      /* Only enable collaboration extensions when provider exists */
      editorSetup ? Collaboration.configure({ document: editorSetup.ydoc }) : undefined,
      editorSetup ? CollaborationCursor.configure({               
        provider: editorSetup.provider,
        user: { 
          name: getRandomName(), 
          color: getRandomColor()
        },
      }) : undefined,
      /* Formatting Extensions */
      Highlight,
      Underline,
      LineHeight,
      TextStyle,
      FontFamily,
      FontSize,
    ].filter(Boolean), // Remove undefined extensions
  }, [editorSetup])

  /* Show loading state while connecting */
  if (!editor || !editorSetup) {
    return (
      <div className="editor-card flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading Document...</div>
      </div>
    )
  }

  /* Render Editor UI */
  return (
    <div className="editor-card">
      <div className="editor-header">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back
          </button>
          <h1 className="editor-title">Document: {roomID.slice(0, 8)}...</h1>
        </div>
        <span className={`status-badge ${status === 'connected' ? 'status-connected' : 'status-disconnected'}`}>
          {status}
        </span>
      </div>

      <div className="editor-content">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

/* App Entry Point with Routing */
export default function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/documents/:id" element={<TiptapEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}