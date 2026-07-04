'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoomByCode, addRoomParticipant } from '@/lib/db';

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate room exists and is waiting
      const room = await getRoomByCode(roomCode.toUpperCase());
      if (!room) {
        setError('Room code not found');
        setLoading(false);
        return;
      }

      if (room.status !== 'waiting') {
        setError('This room is not accepting new participants');
        setLoading(false);
        return;
      }

      if (!name.trim()) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }

      // Add participant
      const participant = await addRoomParticipant(room.id, name);
      if (!participant) {
        setError('Failed to join room');
        setLoading(false);
        return;
      }

      // Redirect to room lobby
      router.push(`/room/${roomCode.toUpperCase()}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-graph-paper">
      <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-white hover:opacity-80 transition focus-ring rounded px-2 py-1">
            ← Back Home
          </Link>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-navy mb-3 sm:mb-4">
            Join a Room
          </h1>
          <p className="text-sm sm:text-base text-ink-navy font-body opacity-75">
            Enter the room code from your instructor
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 sm:p-8 shadow-lg">
          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-display font-bold text-ink-navy mb-2">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-leaf-green focus:outline-none font-mono text-lg tracking-widest text-center transition-colors"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs sm:text-sm font-display font-bold text-ink-navy mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-leaf-green focus:outline-none font-body transition-colors"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-coral-flare bg-opacity-10 border-l-4 border-coral-flare rounded">
              <p className="text-coral-flare font-body text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !roomCode || !name}
            className="w-full py-3 bg-leaf-green text-white font-display font-bold rounded-lg hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all min-h-[44px]"
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
      </main>
    </div>
  );
}
