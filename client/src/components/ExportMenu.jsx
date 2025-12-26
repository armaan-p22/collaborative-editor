import { useState } from 'react'

export default function ExportMenu({ editor, title }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDownloadText = () => {
        if (!editor) return
        const text = editor.getText()
        const blob = new Blob([text], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${title}.txt`
        a.click()
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="relative inline-block text-left mr-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded border border-gray-300 transition-colors"
            >
                Export ▾
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 focus:outline-none">
                    <div className="py-1">
                        <button
                            onClick={() => { handlePrint(); setIsOpen(false) }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            🖨️ Print / PDF
                        </button>
                        <button
                            onClick={() => { handleDownloadText(); setIsOpen(false) }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            📄 Download Text
                        </button>
                    </div>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    )
}