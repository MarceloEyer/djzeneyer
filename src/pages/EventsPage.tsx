{/* Events Calendar */}
<section className="py-12 md:py-16 bg-surface" id="calendar">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 font-display">
      Event Calendar
    </h2>
    
    <div className="card p-4 md:p-6 overflow-hidden">
      <div className="relative pb-4">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-white/70">
            View and subscribe to DJ Zen Eyer's official event calendar
          </p>
          <a 
            href="https://calendar.google.com/calendar/u/0?cid=ZXllci5tYXJjZWxvQGdtYWlsLmNvbQ" 
             
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-light transition-colors flex items-center text-sm"
          >
            <span>Add to your calendar</span>
            <ArrowRight size={14} className="ml-1" aria-hidden="true" />
          </a>
        </div>
        
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white/5">
          <div className="aspect-[4/3] md:aspect-[16/9] w-full">
            <iframe 
              src="https://calendar.google.com/calendar/embed?src=eyer.marcelo%40gmail.com&ctz=America%2FSao_Paulo&bgcolor=%23121212&color=%23039BE5&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&showTz=1" 
              style={{ border: 0 }} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no"
              title="DJ Zen Eyer Event Calendar"
              className="w-full h-full"
              loading="lazy"
            ></iframe>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-white/50">
          <p>
            Calendar is updated regularly with all upcoming events. 
            Click on any event for details and ticket information.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>