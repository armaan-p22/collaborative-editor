/* Imports */
import './App.css'
import Toolbar from './Toolbar.jsx'
import Home from './Home.jsx'
import Login from './Login.jsx'
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
import { WS_URL } from './config'

/* Extension Imports */
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { LineHeight } from './extensions/LineHeight'
import { FontSize } from './extensions/FontSize'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Image from '@tiptap/extension-image'

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
const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)]
const getRandomColor = () => getRandomElement(userColors)

const addToRecentDocuments = (id, title = 'Untitled Document') => {
  const existing = JSON.parse(localStorage.getItem('recent-docs') || '[]')
  const oldEntry = existing.find(doc => doc.id === id)

  const newEntry = {
    id,
    title: oldEntry ? oldEntry.title : title,
    lastOpened: new Date().toLocaleString()
  }

  const filtered = existing.filter(doc => doc.id !== id)
  const updated = [newEntry, ...filtered].slice(0,10)
  localStorage.setItem('recent-docs', JSON.stringify(updated))
}

const TiptapEditor = ({ user }) => {
  const { id: roomID } = useParams()
  const [status, setStatus] = useState('connecting...')
  const navigate = useNavigate()
  
  const [editorSetup, setEditorSetup] = useState(null)

  useEffect(() => {
    addToRecentDocuments(roomID)
    const newYdoc = new Y.Doc()
    const newProvider = new WebsocketProvider(WS_URL, roomID, newYdoc)
    const newPersistence = new IndexeddbPersistence(roomID, newYdoc)

    const handleStatus = (event) => {
      setStatus(event.status)
    }
    newProvider.on('status', handleStatus)

    setEditorSetup({ ydoc: newYdoc, provider: newProvider })

    return () => {
      newProvider.off('status', handleStatus)
      newProvider.destroy()
      newYdoc.destroy()
      newPersistence.destroy()
    }
  }, [roomID])

  const editor = useEditor({
    editable: !!editorSetup, 
    extensions: [
      StarterKit.configure({ 
        history: false, 
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        }, 
      }),

      editorSetup ? Collaboration.configure({ document: editorSetup.ydoc }) : undefined,
      editorSetup ? CollaborationCursor.configure({               
        provider: editorSetup.provider,
        user: { 
          name: user.username, 
          color: getRandomColor()
        },
      }) : undefined,

      Image,
      Highlight,
      Underline,
      LineHeight,
      TextStyle,
      FontFamily,
      FontSize,
    ].filter(Boolean), 
  }, [editorSetup, user]) 

  if (!editor || !editorSetup) {
    return (
      <div className="editor-card flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading Document...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] print-layout">
      
      <div className="bg-white border-b shadow-sm z-50 print-hide">
        <div className="max-w-screen-2xl mx-auto px-4">
          <EditorHeader 
            roomID={roomID} 
            status={status} 
            onBack={() => navigate('/')} 
            provider={editorSetup.provider}
            ydoc={editorSetup.ydoc}
            editor={editor}
            currentUser={user}
          />
          <Toolbar editor={editor} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto print-scroll-container">
        <div className="editor-card">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user_info')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const handleLogin = (userData, token) => {
    setUser(userData)
    localStorage.setItem('auth_token', token)
    localStorage.setItem('user_info', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/documents/:id" element={<TiptapEditor user={user} />} />
      </Routes>
    </BrowserRouter>
  )
}