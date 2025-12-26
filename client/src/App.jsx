/* Imports */
import './App.css'
import Toolbar from './Toolbar.jsx'
import Home from './Home.jsx'
import EditorHeader from './components/EditorHeader.jsx'
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
const userColors = [
  '#2563EB',
  '#DC2626', 
  '#D97706', 
  '#059669', 
  '#7C3AED', 
  '#DB2777', 
  '#EA580C', 
  '#0891B2', 
  '#4F46E5', 
  '#16A34A', 
]
const getRandomColor = () => getRandomElement(userColors)

const getUser = () => {
  const savedUser = localStorage.getItem('editor-user')
  if (savedUser) {
    return JSON.parse(savedUser)
  }

  const newUser = {
    name: `${getRandomElement(adjectives)} ${getRandomElement(animals)}`,
    color: getRandomColor()
  }
  localStorage.setItem('editor-user', JSON.stringify(newUser))
  return newUser
}

const currentUser = getUser()

const addToRecentDocuments = (id) => {
  const exisiting = JSON.parse(localStorage.getItem('recent-docs') || '[]')

  const oldEntry = exisiting.find(doc => doc.id === id)

  // create a new entry
  const newEntry = {
    id,
    title: oldEntry ? oldEntry.title : 'Untitled Document',
    lastOpened: new Date().toLocaleString()
  }

  const filtered = exisiting.filter(doc => doc.id !== id)
  const updated = [newEntry, ...filtered].slice(0,10)
  localStorage.setItem('recent-docs', JSON.stringify(updated))
}

/* Main Editor Component */
const TiptapEditor = () => {
  const { id: roomID } = useParams()
  const [status, setStatus] = useState('connecting...')
  const navigate = useNavigate()
  
  const [editorSetup, setEditorSetup] = useState(null)

  /* Setup Yjs Provider & WebSocket connection */
  useEffect(() => {
    // save to history
    addToRecentDocuments(roomID)
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
          name: currentUser.name, 
          color: currentUser.color
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
    <div className="flex flex-col h-screen bg-[#F3F4F6]">
      
      <div className="bg-white border-b shadow-sm z-50">
        <div className="max-w-screen-2xl mx-auto px-4">
          <EditorHeader 
            roomID={roomID} 
            status={status} 
            onBack={() => navigate('/')} 
            provider={editorSetup.provider}
            ydoc={editorSetup.ydoc}
            editor={editor}
          />
          <Toolbar editor={editor} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="editor-card">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents/:id" element={<TiptapEditor />} />
      </Routes>
    </BrowserRouter>
  )
}