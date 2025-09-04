import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useWatchParty = (roomId, playerRef) => {
    const socketRef = useRef(null);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000/api'); // server URL

        socketRef.current.emit('join-room', roomId);

        socketRef.current.on('receive-playback-action', ({ action, time }) => {
            const player = playerRef.current?.internalPlayer;
            if (player) {
                setIsSyncing(true); // Prevent sending events back
                switch (action) {
                    case 'play':
                        player.seekTo(time, true);
                        player.playVideo();
                        break;
                    case 'pause':
                        player.pauseVideo();
                        player.seekTo(time, true);
                        break;
                }
                // Allow sending events again after a short delay
                setTimeout(() => setIsSyncing(false), 500);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [roomId, playerRef]);

    const sendPlaybackAction = async (action) => {
        if (socketRef.current && !isSyncing) {
            const player = playerRef.current?.internalPlayer;
            if (player) {
                const time = await player.getCurrentTime();
                socketRef.current.emit('send-playback-action', { roomId, action, time });
            }
        }
    };

    return { sendPlaybackAction };
};