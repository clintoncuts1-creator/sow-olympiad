'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoomByCode, getRoomParticipants } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import type { Room, RoomParticipant } from '@/lib/db';

export default function RoomLobby() {
  const params = useParams();
  const router = useRouter();
  const code = (params.code as string).toUpperCase();

  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRoom = async () => {
      const roomData = await getRoomByCode(code);
      if (!roomData) {
        setError('Room not found');
        setLoading(false);
        return;
      }
      setRoom(roomData);

      // Load participants
      const participantsData = await getRoomParticipants(roomData.id);
      setParticipants(participantsData);

      // Subscribe to real-time updates
      const subscription = supabase
        .channel(`room:${roomData.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'room_participants',
            filter: `room_id=eq.${roomData.id}`,
          },
          (_payload) => {
            // Reload participants on any change
            getRoomParticipants(roomData.id).then(setParticipants);
          }
        )
        .subscribe();

      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    loadRoom();
  }, [code]);

  const handleStart = async () => {
    if (!room) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .update({ status: 'active', started_at: new Date().toISOString() })
        .eq('id', room.id);

      if (error) throw error;

      // Redirect to play page
      router.push(`/room/${code}/play`);
    } catch (err) {
      setError('Failed to start room');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-ink-slate">Loading room...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-white hover:opacity-80 transition">
              ← Back Home
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-coral mb-8">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sage text-white font-space-grotesk font-bold rounded-lg hover:opacity-90 transition"
          >
            Back Home
          </Link>
        </main>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="min-h-screen bg-graph-paper">
      <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-white hover:opacity-80 transition focus-ring rounded px-2 py-1 text-sm sm:text-base">
            ← Back Home
          </Link>
          <div className="text-right">
            <p className="text-xs sm:text-sm opacity-75 font-body">Room Code</p>
            <p className="text-xl sm:text-2xl font-display font-bold font-mono tracking-widest">
              {code}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Room Info */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-navy mb-4">
              {room.section_id}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
              <div>
                <p className="text-ink-navy font-body opacity-75 text-xs sm:text-sm">Round Type</p>
                <p className="text-lg font-display font-bold text-ink-navy capitalize">
                  {room.round_type === 'grid' ? '5×5 Grid' : room.round_type === 'tiered' ? 'Tiered' : 'Speed Sprint'}
                </p>
              </div>
              <div>
                <p className="text-ink-navy font-body opacity-75 text-xs sm:text-sm">Status</p>
                <p className="text-lg font-display font-bold text-ink-navy capitalize flex items-center gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full ${room.status === 'waiting' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                  {room.status === 'waiting' ? '⏳ Waiting' : '▶ Active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-display font-bold text-ink-navy mb-4 sm:mb-6">
            Participants ({participants.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {participants.map((participant, idx) => (
              <div 
                key={participant.id} 
                className="bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <p className="font-display font-bold text-ink-navy truncate">
                  {participant.student_name}
                </p>
                <p className="text-sm text-ink-navy font-mono mt-2 opacity-75">
                  Score: <span className="font-bold">{participant.live_score}</span>
                </p>
              </div>
            ))}
          </div>
          
          {participants.length === 0 && (
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
              <p className="text-ink-navy font-body opacity-75">Waiting for participants to join...</p>
            </div>
          )}
        </div>

        {/* Admin Controls or Waiting Message */}
        {room.status === 'waiting' && (
          <div className="space-y-4">
            {/* Admin controls would check if user is admin */}
            <div className="bg-white rounded-lg p-6 sm:p-8 text-center border-2 border-leaf-green">
              <p className="text-ink-navy font-body mb-4 text-sm sm:text-base">
                Admin: Ready to start the round?
              </p>
              <button
                onClick={handleStart}
                className="px-6 sm:px-8 py-3 bg-leaf-green text-white font-display font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all focus-ring"
              >
                Start Round
              </button>
            </div>

            {participants.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-calculator-blue rounded-lg p-6">
                <p className="text-ink-navy font-body text-sm sm:text-base">
                  ⏳ Waiting for the instructor to start the round...
                </p>
              </div>
            )}
          </div>
        )}

        {room.status === 'active' && (
          <div className="bg-green-50 border-l-4 border-leaf-green rounded-lg p-6 text-center">
            <p className="text-ink-navy font-body text-sm sm:text-base">
              ▶ Round is now active. Starting shortly...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
