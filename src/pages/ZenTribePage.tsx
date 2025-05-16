// Mini Music Player (Fixed at bottom)
<div className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-sm p-3 border-t border-white/10 z-50 transform translate-y-full opacity-0 transition-all duration-500 hover:translate-y-0 hover:opacity-100 group">
  <div className="container mx-auto flex items-center justify-between">
    <div className="flex items-center">
      <img src="/album-cover-placeholder.jpg" alt="Now playing" className="w-10 h-10 rounded mr-3" />
      <div>
        <h4 className="font-medium text-sm">Zen Rhythms Vol. 3</h4>
        <p className="text-xs text-white/70">DJ Zen Eyer</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <button className="text-white/80 hover:text-primary transition-colors" aria-label="Previous track">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="19 20 9 12 19 4 19 20"></polygon>
          <line x1="5" y1="19" x2="5" y2="5"></line>
        </svg>
      </button>
      <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors" aria-label="Play or pause">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </button>
      <button className="text-white/80 hover:text-primary transition-colors" aria-label="Next track">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 4 15 12 5 20 5 4"></polygon>
          <line x1="19" y1="5" x2="19" y2="19"></line>
        </svg>
      </button>
    </div>
  </div>
  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-surface px-4 py-1 rounded-t-lg border-t border-l border-r border-white/10 text-xs font-medium">
    <span className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      Player
    </span>
  </div>
</div>