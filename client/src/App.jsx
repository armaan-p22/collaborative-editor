import './App.css'
import Toolbar from './Toolbar.jsx'
import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import { LineHeight } from './extensions/LineHeight'
import { FontSize } from './extensions/FontSize'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'

const ROOM_NAME = 'my-collaborative-doc-v1'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', ROOM_NAME, ydoc)
const persistence = new IndexeddbPersistence(ROOM_NAME, ydoc)

const adjectives = ['Happy', 'Cool', 'Swift', 'Chill', 'Brave', 'Smart', 'Wild']
const animals = ['Panda', 'Tiger', 'Eagle', 'Badger', 'Fox', 'Koala', 'Hawk']
const getRandomElement = (list) => list[Math.floor(Math.random() * list.length)]
const getRandomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16)

const getRandomName = () => {
  return `${getRandomElement(adjectives)} ${getRandomElement(animals)}`
}

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
      StarterKit.configure({ 
        history: false,
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        }, 
      }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({              
        provider: provider,
        user: { 
          name: getRandomName(), 
          color: getRandomColor()
        },
      }),
      Highlight,
      Underline,
      LineHeight,
      TextStyle,
      FontFamily,
      FontSize,
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
        <Toolbar editor={editor} />
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