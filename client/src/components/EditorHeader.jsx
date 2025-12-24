import CopyButton from './CopyButton'
import Avatars from './Avatars'

const EditorHeader = ({ roomID, status, onBack, provider }) => {
  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack} 
          className="text-gray-500 hover:text-black text-sm font-medium transition-colors"
        >
          ← Back
        </button>
        
        <h1 className="text-xl font-bold text-gray-800">
          Document: <span className="text-gray-500 font-normal">{roomID.slice(0, 8)}...</span>
        </h1>

        <CopyButton />
      </div>

      <div className="flex items-center gap-2">
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