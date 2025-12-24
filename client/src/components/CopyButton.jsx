import { useState } from 'react'

export default function CopyButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button 
      onClick={handleCopy}
      className={`px-4 py-1 rounded text-sm font-medium transition-colors ${
        copied 
          ? 'bg-green-500 text-white' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {copied ? 'Link Copied!' : 'Share Document'}
    </button>
  )
}