import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, Download, Heart, Share2, Plus, Filter } from 'lucide-react';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';
import { formatTime } from '../utils/formatTime';

// Additional sample tracks
const allTracks = [
  {
    id: '1',
    title: 'Cosmic Enlightenment',
    artist: 'DJ Zen Eyer',
    duration: 245,
    artwork: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/cosmic-enlightenment.mp3',
    album: 'Zen State',
    releaseDate: '2025-03-15',
    tags: ['ambient', 'electronic', 'meditation'],
  },
  {
    id: '2',
    title: 'Neural Pathways',
    artist: 'DJ Zen Eyer',
    duration: 318,
    artwork: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/neural-pathways.mp3',
    album: 'Zen State',
    releaseDate: '2025-03-15',
    tags: ['electronic', 'techno', 'deep'],
  },
  {
    id: '3',
    title: 'Meditation in Motion',
    artist: 'DJ Zen Eyer',
    duration: 287,
    artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/meditation-in-motion.mp3',
    album: 'Zen State',
    releaseDate: '2025-03-15',
    tags: ['downtempo', 'ambient', 'chill'],
  },
  {
    id: '4',
    title: 'Quantum Vibrations',
    artist: 'DJ Zen Eyer',
    duration: 312,
    artwork: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/quantum-vibrations.mp3',
    album: 'Quantum Field Theory',
    releaseDate: '2024-11-10',
    tags: ['electronic', 'dance', 'energetic'],
  },
  {
    id: '5',
    title: 'Astral Projection',
    artist: 'DJ Zen Eyer ft. Luna Echo',
    duration: 275,
    artwork: 'https://images.pexels.com/photos/207153/pexels-photo-207153.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/astral-projection.mp3',
    album: 'Quantum Field Theory',
    releaseDate: '2024-11-10',
    tags: ['collaboration', 'vocals', 'house'],
  },
  {
    id: '6',
    title: 'Mindful Beats',
    artist: 'DJ Zen Eyer',
    duration: 256,
    artwork: 'https://images.pexels.com/photos/268941/pexels-photo-268941.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/mindful-beats.mp3',
    album: 'Quantum Field Theory',
    releaseDate: '2024-11-10',
    tags: ['meditation', 'instrumental', 'deep'],
  },
  {
    id: '7',
    title: 'Conscious Dance',
    artist: 'DJ Zen Eyer',
    duration: 334,
    artwork: 'https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/conscious-dance.mp3',
    album: 'Early Singles',
    releaseDate: '2024-05-22',
    tags: ['dance', 'uptempo', 'electronic'],
  },
  {
    id: '8',
    title: 'Inner Space Journey',
    artist: 'DJ Zen Eyer',
    duration: 298,
    artwork: 'https://images.pexels.com/photos/534757/pexels-photo-534757.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioSrc: 'https://example.com/inner-space-journey.mp3',
    album: 'Early Singles',
    releaseDate: '2024-05-22',
    tags: ['introspective', 'ambient', 'experimental'],
  },
];

// Album data
const albums = [
  {
    id: '1',
    title: 'Zen State',
    releaseDate: '2025-03-15',
    artwork: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=600',
    trackCount: 3,
  },
  {
    id: '2',
    title: 'Quantum Field Theory',
    releaseDate: '2024-11-10',
    artwork: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=600',
    trackCount: 3,
  },
  {
    id: '3',
    title: 'Early Singles',
    releaseDate: '2024-05-22',
    artwork: 'https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg?auto=compress&cs=tinysrgb&w=600',
    trackCount: 2,
  },
];

// Playlist data
const playlists = [
  {
    id: '1',
    title: 'Meditation Mix',
    curator: 'DJ Zen Eyer',
    artwork: 'https://images.pexels.com/photos/747964/pexels-photo-747964.jpeg?auto=compress&cs=tinysrgb&w=600',
    trackCount: 6,
  },
  {
    id: '2',
    title: 'High Energy Set',
    curator: 'DJ Zen Eyer',
    artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
    trackCount: 8,
  },
  {
    id: '3',
    title: 'Late Night Vibes',
    curator: 'Zen Tribe',
    artwork: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
    trackCount: 10,
  },
];

type ViewMode = 'tracks' | 'albums' | 'playlists';

const MusicPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('tracks');
  const [filterOpen, setFilterOpen] = useState(false);
  const { playTrack, addToQueue } = useMusicPlayer();

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const trackItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const filterTags = ['All', 'Electronic', 'Ambient', 'Meditation', 'Dance', 'Chill', 'Deep', 'Experimental'];

  return (
    <div className="pt-24 min-h-screen">
      {/* Page Header */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Music
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore DJ Zen Eyer's discography, from meditative ambient journeys to high-energy electronic dance tracks.
            </p>
          </motion.div>
        </div>
      </div>

      {/* View Selector and Filters */}
      <section className="sticky top-20 z-20 bg-background/80 backdrop-blur-md shadow-md py-4 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* View Mode Tabs */}
            <div className="flex">
              <button 
                onClick={() => setViewMode('tracks')}
                className={`px-4 py-2 rounded-l-md ${viewMode === 'tracks' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-white/70 hover:bg-white/10'}`}
              >
                Tracks
              </button>
              <button 
                onClick={() => setViewMode('albums')}
                className={`px-4 py-2 ${viewMode === 'albums' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-white/70 hover:bg-white/10'}`}
              >
                Albums
              </button>
              <button 
                onClick={() => setViewMode('playlists')}
                className={`px-4 py-2 rounded-r-md ${viewMode === 'playlists' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-white/70 hover:bg-white/10'}`}
              >
                Playlists
              </button>
            </div>

            {/* Filter Button - Mobile */}
            <button
              className="md:hidden flex items-center gap-1 px-3 py-2 bg-surface text-white/70 rounded-md hover:bg-white/10"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={16} />
              <span>Filter</span>
            </button>

            {/* Filter Tags - Desktop */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-2 max-w-xl">
              {filterTags.map((tag, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    index === 0 
                      ? 'bg-primary text-white' 
                      : 'bg-surface text-white/70 hover:bg-white/10'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {filterOpen && (
            <div className="md:hidden mt-3 p-3 bg-surface rounded-md shadow-lg border border-white/10">
              <div className="flex flex-wrap gap-2">
                {filterTags.map((tag, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      index === 0 
                        ? 'bg-primary text-white' 
                        : 'bg-surface/80 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Tracks View */}
          {viewMode === 'tracks' && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display">Latest Tracks</h2>
                <button className="text-sm text-primary">Play All</button>
              </div>

              <div className="overflow-x-auto">
                <motion.table 
                  className="w-full min-w-[768px]"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="py-4 px-4 text-left font-medium text-white/70">#</th>
                      <th className="py-4 px-4 text-left font-medium text-white/70">Title</th>
                      <th className="py-4 px-4 text-left font-medium text-white/70">Album</th>
                      <th className="py-4 px-4 text-left font-medium text-white/70">Duration</th>
                      <th className="py-4 px-4 text-right font-medium text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTracks.map((track, index) => (
                      <motion.tr 
                        key={track.id}
                        className="border-b border-white/5 hover:bg-white/5"
                        variants={trackItem}
                      >
                        <td className="py-4 px-4 text-white/70">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="relative w-10 h-10 mr-3 flex-shrink-0 group">
                              <img 
                                src={track.artwork} 
                                alt={track.title} 
                                className="w-full h-full rounded object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  onClick={() => playTrack(track)}
                                  className="text-white"
                                >
                                  <PlayCircle size={20} />
                                </button>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium">{track.title}</h3>
                              <p className="text-sm text-white/70">{track.artist}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/70">{track.album}</td>
                        <td className="py-4 px-4 text-white/70">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{formatTime(track.duration)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              className="text-white/70 hover:text-white transition-colors"
                              onClick={() => addToQueue(track)}
                            >
                              <Plus size={18} />
                            </button>
                            <button className="text-white/70 hover:text-white transition-colors">
                              <Heart size={18} />
                            </button>
                            <button className="text-white/70 hover:text-white transition-colors">
                              <Share2 size={18} />
                            </button>
                            <button className="text-white/70 hover:text-white transition-colors">
                              <Download size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>
            </>
          )}

          {/* Albums View */}
          {viewMode === 'albums' && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-display">Albums & EPs</h2>
              </div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {albums.map((album) => (
                  <motion.div 
                    key={album.id}
                    className="card overflow-hidden group"
                    variants={trackItem}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={album.artwork} 
                        alt={album.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <PlayCircle size={28} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{album.title}</h3>
                      <p className="text-white/70">Released: {new Date(album.releaseDate).toLocaleDateString()}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm text-white/50">
                          {album.trackCount} tracks
                        </span>
                        <div className="flex space-x-2">
                          <button className="text-white/70 hover:text-white transition-colors">
                            <Heart size={18} />
                          </button>
                          <button className="text-white/70 hover:text-white transition-colors">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {/* Playlists View */}
          {viewMode === 'playlists' && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold font-display">Featured Playlists</h2>
                <button className="text-primary hover:text-primary-light transition-colors">Create Playlist</button>
              </div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                {playlists.map((playlist) => (
                  <motion.div 
                    key={playlist.id}
                    className="card overflow-hidden group"
                    variants={trackItem}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={playlist.artwork} 
                        alt={playlist.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <PlayCircle size={28} />
                        </button>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-secondary">
                          {playlist.trackCount} tracks
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{playlist.title}</h3>
                      <p className="text-white/70">By {playlist.curator}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <button className="text-primary hover:text-primary-light transition-colors text-sm">
                          View Tracks
                        </button>
                        <div className="flex space-x-2">
                          <button className="text-white/70 hover:text-white transition-colors">
                            <Plus size={18} />
                          </button>
                          <button className="text-white/70 hover:text-white transition-colors">
                            <Share2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Create Playlist Card */}
                <motion.div 
                  className="card overflow-hidden border-2 border-dashed border-white/20 flex items-center justify-center aspect-square cursor-pointer hover:border-primary transition-colors"
                  variants={trackItem}
                >
                  <div className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Plus size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Create New Playlist</h3>
                    <p className="text-white/70 text-sm">
                      Curate your own collection of favorite tracks
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Exclusive Content Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl overflow-hidden">
            <div className="md:w-1/2 p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="badge badge-primary mb-4">Zen Tribe Exclusive</span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                  Unlock Exclusive Music Content
                </h2>
                <p className="text-lg text-white/80 mb-6">
                  Join the Zen Tribe to access unreleased tracks, remixes, and behind-the-scenes content only available to members.
                </p>
                <button className="btn btn-primary">
                  Join the Zen Tribe
                </button>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.img 
                src="https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Exclusive music content" 
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MusicPage;