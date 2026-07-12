'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllSections, createRoom } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import type { Section, Room } from '@/lib/db';

export default function HostPanel() {
  const [sections, setSections] = useState<Section[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedRound, setSelectedRound] = useState('grid');
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const sectionsData = await getAllSections();
      setSections(sectionsData);
      if (sectionsData.length > 0) {
        setSelectedSection(sectionsData[0].id);
      }

      // Load active/recent rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .in('status', ['waiting', 'active', 'completed'])
        .order('created_at', { ascending: false })
        .limit(10);

      setRooms(roomsData || []);

      // Subscribe to room updates
      const subscription = supabase
        .channel('rooms')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rooms',
          },
          (_payload) => {
            // Reload rooms
            supabase
              .from('rooms')
              .select('*')
              .in('status', ['waiting', 'active', 'completed'])
              .order('created_at', { ascending: false })
              .limit(10)
              .then((res) => setRooms(res.data || []));
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/host/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!selectedSection) {
        setError('Please select a section');
        setLoading(false);
        return;
      }

      const room = await createRoom(selectedRound as any, selectedSection, timeLimitSeconds);
      if (!room) {
        setError('Failed to create room');
        setLoading(false);
        return;
      }

      setSuccess(`Room created! Code: ${room.code}`);
      setSelectedRound('grid');
      setTimeLimitSeconds(300);

      // Reload rooms
      const { data: roomsData } = await supabase
        .from('rooms')
        .select('*')
        .in('status', ['waiting', 'active', 'completed'])
        .order('created_at', { ascending: false })
        .limit(10);

      setRooms(roomsData || []);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-graph-paper">
      <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="text-lg sm:text-2xl font-display font-bold truncate">Host Panel</h1>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-marigold hover:opacity-80 transition focus-ring rounded px-2 py-1 text-sm font-body">
              Back Home
            </Link>
            <button
              onClick={handleLogout}
              className="text-coral-flare hover:opacity-80 transition focus-ring rounded px-2 py-1 text-sm font-body"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Create Room Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-navy mb-6">
                Create Room
              </h2>

              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-display font-bold text-ink-navy mb-2">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-leaf-green focus:outline-none font-body transition-colors disabled:opacity-50"
                  >
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-display font-bold text-ink-navy mb-2">
                    Round Type
                  </label>
                  <select
                    value={selectedRound}
                    onChange={(e) => setSelectedRound(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-leaf-green focus:outline-none font-body transition-colors disabled:opacity-50"
                  >
                    <option value="grid">Grid</option>
                    <option value="tiered">Tiered</option>
                    <option value="sprint">Sprint</option>
                  </select>
                </div>

                {selectedRound === 'sprint' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-display font-bold text-ink-navy mb-2">
                      Time Limit (seconds)
                    </label>
                    <input
                      type="number"
                      value={timeLimitSeconds}
                      onChange={(e) => setTimeLimitSeconds(parseInt(e.target.value))}
                      disabled={loading}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-leaf-green focus:outline-none font-body transition-colors disabled:opacity-50"
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-coral-flare bg-opacity-10 border-l-4 border-coral-flare rounded">
                    <p className="text-coral-flare text-xs sm:text-sm font-body">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-leaf-green bg-opacity-10 border-l-4 border-leaf-green rounded">
                    <p className="text-leaf-green text-sm font-display font-bold">{success}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-leaf-green text-white font-display font-bold rounded-lg hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all focus-ring min-h-[44px]"
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </button>
              </form>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-300">
                <Link
                  href="/admin"
                  className="block text-center py-3 border-2 border-ink-navy text-ink-navy font-display font-bold rounded-lg hover:bg-ink-navy hover:text-white active:scale-95 transition-all focus-ring text-sm sm:text-base"
                >
                  Manage Questions
                </Link>
              </div>
            </div>
          </div>

          {/* Active Rooms List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-ink-navy mb-4 sm:mb-6">
              Active & Recent Rooms
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {rooms.length === 0 ? (
                <div className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-md">
                  <p className="text-ink-navy font-body opacity-75">No rooms created yet</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <Link
                    key={room.id}
                    href={`/room/${room.code}`}
                    className="block bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-lg transition-all border-l-4 border-leaf-green active:scale-95 focus-ring"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-lg sm:text-2xl font-display font-bold font-mono tracking-widest text-ink-navy truncate">
                          {room.code}
                        </p>
                        <p className="text-xs sm:text-sm text-ink-navy font-body opacity-75 mt-1">
                          {room.round_type === 'grid' ? '5×5 Grid' : room.round_type === 'tiered' ? 'Tiered' : 'Speed Sprint'} •{' '}
                          {new Date(room.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right whitespace-nowrap">
                        <span
                          className={`inline-block px-2 sm:px-3 py-1 rounded font-display font-bold text-xs sm:text-sm ${
                            room.status === 'waiting'
                              ? 'bg-yellow-100 text-yellow-800'
                              : room.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
