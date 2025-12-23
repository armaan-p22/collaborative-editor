import React from 'react'

const Toolbar = ({ editor }) => {
    if (!editor) {
        return null
    }

    const getCurrentHeading = () => {
        if (editor.isActive('heading', { level: 1 })) return 'h1'
        if (editor.isActive('heading', { level: 2 })) return 'h2'
        if (editor.isActive('heading', { level: 3 })) return 'h3'
        return 'paragraph'
    }

    const handleHeadingChange = (e) => {
        const value = e.target.value
        
        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run()
        } else if (value === 'h1') {
            editor.chain().focus().toggleHeading({ level: 1 }).run()
        } else if (value === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run()
        } else if (value === 'h3') {
            editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
    }

    const getCurrentLineHeight = () => {
        if (editor.isActive('heading')) {
            return editor.getAttributes('heading').lineHeight || '1.0'
        }
        return editor.getAttributes('paragraph').lineHeight || '1.0'
    }

    const getCurrentFont = () => {
        return editor.getAttributes('textStyle').fontFamily || 'Inter' 
    }

    const getCurrentFontSize = () => {
        return editor.getAttributes('textStyle').fontSize || '16'
    }
    
    return (
        <div className="toolbar-container">

            <select
                value={getCurrentFont()}
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                className="toolbar-select w-32" 
                title="Font Family"
            >
                <option value="Inter">Inter (Default)</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans</option>
            </select>

            <select
                value={getCurrentFontSize()}
                onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
                className="toolbar-select w-16" // Narrow width
                title="Font Size"
            >
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="30">30</option>
            </select>
            
            <select 
                value={getCurrentHeading()} 
                onChange={handleHeadingChange}
                className="toolbar-select"
            >
                <option value="paragraph">Normal Text</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
            </select>

            <select
                value={getCurrentLineHeight()}
                onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
                className="toolbar-select"
                title="Line Spacing"
            >
                <option value="1.0">Single (1.0)</option>
                <option value="1.15">1.15</option>
                <option value="1.5">1.5</option>
                <option value="2.0">Double (2.0)</option>
            </select>
            
            <div className="toolbar-separator"></div>

            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'toolbar-btn toolbar-btn-active' : 'toolbar-btn'}
                title="Bold"
            >
                <span className="font-bold">B</span>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'toolbar-btn toolbar-btn-active' : 'toolbar-btn'}
                title="Italic"
            >
                <span className="italic">i</span>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'toolbar-btn toolbar-btn-active' : 'toolbar-btn'}
                title="Underline"
            >
                <span className="underline">U</span>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                disabled={!editor.can().chain().focus().toggleHighlight().run()}
                className={editor.isActive('highlight') ? 'toolbar-btn toolbar-btn-active' : 'toolbar-btn'}
                title="Highlight"
            >
                <span className="bg-yellow-200 text-black font-bold px-1">H</span>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'toolbar-btn toolbar-btn-active' : 'toolbar-btn'}
                title="Strike"
            >
                <span className="line-through">S</span>
            </button>

            <div className="toolbar-separator"></div>

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'toolbar-btn toolbar-btn-active' : 'toolbar-btn'}
                title="Blockquote"
            >
                ""
            </button>

            <div className="toolbar-separator"></div>

            <button
                onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                className="toolbar-btn toolbar-btn-clear" 
                title="Clear Formatting"
            >
                Tx
            </button>

        </div>
    )
}

export default Toolbar