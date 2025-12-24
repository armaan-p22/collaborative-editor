import { useEffect, useState } from 'react'

export default function Avatars({ provider }) {
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!provider) return
        const awareness = provider.awareness

        // helper to update the local state from Yjs
        const updateUsers = () => {
            // get all states from the awareness protocol
            const states = awareness.getStates()

            // transform map to array
            const activeUsers = Array.from(states.values())
                .filter(user => user.user)
                .map(user => user.user)
            setUsers(activeUsers)
        }

        // initial load
        updateUsers()

        // listen for changes so joins, leaves or updates
        awareness.on('update', updateUsers)

        return () => {
            awareness.off('change', updateUsers)
        }
    }, [provider])

    return (
        <div className="flex -space-x-2 overflow-hidden">
            {users.map((user, index) => (
                <div
                    key={index}
                    className="relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-white text-white text-xs font-bold uppercase shadow-sm ring-1 ring-gray-200"
                    style={{ backgroundColor: user.color }}
                    title={user.name} // hover to see the users name
                >
                    {user.name.charAt(0)}
                </div>
            ))}
        </div>
    )
}