
import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_TRAINS } from './constants';
import { Train, Booking, SeatStatus } from './types';
import Layout from './components/Layout';
import SeatSelector from './components/SeatSelector';
import { getTravelAssistance } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'bookings'>('search');
  const [trains, setTrains] = useState<Train[]>(MOCK_TRAINS);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Persistence
  useEffect(() => {
    const savedBookings = localStorage.getItem('railreserve_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, []);

  useEffect(() => {
    localStorage.setItem('railreserve_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredTrains = trains.filter(t => 
    t.to.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(s => s !== seatNumber) 
        : [...prev, seatNumber]
    );
  };

  const handleBook = () => {
    if (!selectedTrain) return;

    const newBooking: Booking = {
      id: `BK-${Date.now()}`,
      trainId: selectedTrain.id,
      trainName: selectedTrain.name,
      seatNumbers: [...selectedSeats],
      totalPrice: selectedSeats.length * selectedTrain.price,
      date: new Date().toLocaleDateString(),
      customerName: 'Guest User'
    };

    // Update trains (simulated backend)
    setTrains(prevTrains => prevTrains.map(t => {
      if (t.id === selectedTrain.id) {
        return {
          ...t,
          availableSeats: t.availableSeats - selectedSeats.length,
          seats: t.seats.map(s => 
            selectedSeats.includes(s.number) 
              ? { ...s, status: SeatStatus.BOOKED } 
              : s
          )
        };
      }
      return t;
    }));

    setBookings(prev => [newBooking, ...prev]);
    setSelectedTrain(null);
    setSelectedSeats([]);
    alert('Booking successful! View your tickets in My Bookings.');
    setActiveTab('bookings');
  };

  const handleCancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find(b => b.id === bookingId);
    if (!bookingToCancel) return;

    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
      return;
    }

    // Restore seat availability in the trains state
    setTrains(prevTrains => prevTrains.map(t => {
      if (t.id === bookingToCancel.trainId) {
        return {
          ...t,
          availableSeats: t.availableSeats + bookingToCancel.seatNumbers.length,
          seats: t.seats.map(s => 
            bookingToCancel.seatNumbers.includes(s.number) 
              ? { ...s, status: SeatStatus.AVAILABLE } 
              : s
          )
        };
      }
      return t;
    }));

    // Remove the booking from state
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    alert('Booking cancelled successfully. Refund processed to original mode.');
  };

  const askAI = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    const context = trains.map(t => `${t.name} (AMI to ${t.to})`).join(', ');
    const res = await getTravelAssistance(aiQuery, context);
    setAiResponse(res || 'Error processing request.');
    setIsAiLoading(false);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-8">
        {/* AI Assistant Banner */}
        <section className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Rail Assistant
            </h2>
            <p className="text-indigo-100 mb-6 max-w-lg">
              Ask about travel tips to Pune, Mumbai or check for the fastest train from Amaravati.
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="How long is the journey to Mumbai?"
                className="flex-grow bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/50"
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
              />
              <button 
                onClick={askAI}
                disabled={isAiLoading}
                className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>
            {aiResponse && (
              <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/10 animate-fade-in">
                <p className="text-sm leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </div>
        </section>

        {activeTab === 'search' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-white p-4 rounded-2xl border shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">Trains from Amaravati (AMI)</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search destination..."
                    className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 w-full"
                    onChange={handleSearch}
                    value={searchTerm}
                  />
                  <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {filteredTrains.length > 0 ? (
                filteredTrains.map(train => (
                  <div key={train.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-bold uppercase tracking-wider">{train.number}</span>
                          <h4 className="font-bold text-lg text-slate-800">{train.name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500">
                          <div className="flex flex-col">
                            <span className="text-sm">Departure</span>
                            <span className="font-semibold text-slate-800">{train.departureTime}</span>
                          </div>
                          <div className="h-px bg-slate-200 flex-grow relative mx-4 min-w-[40px]">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" /></svg>
                            </div>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-sm">Arrival</span>
                            <span className="font-semibold text-slate-800">{train.arrivalTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-3 min-w-[120px]">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-slate-800">₹ {train.price}</span>
                          <p className="text-xs text-slate-500">{train.availableSeats} seats left</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTrain(train);
                            setSelectedSeats([]);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center border border-dashed">
                  <p className="text-slate-400">No trains found for your search criteria.</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {selectedTrain ? (
                  <SeatSelector
                    train={selectedTrain}
                    selectedSeats={selectedSeats}
                    onToggleSeat={toggleSeat}
                    onBook={handleBook}
                    onCancel={() => setSelectedTrain(null)}
                  />
                ) : (
                  <div className="bg-slate-100 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                    <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">Select a train to see available seats</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Booking History
            </h2>
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking.id} className="bg-white rounded-3xl p-6 border shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{booking.id}</span>
                      <h3 className="text-xl font-bold text-slate-800">{booking.trainName}</h3>
                      <p className="text-sm text-slate-500">Booked on {booking.date}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">CONFIRMED</div>
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs text-red-500 font-semibold hover:text-red-700 transition"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <span className="text-xs text-slate-400 uppercase">Seats</span>
                      <p className="font-semibold">{booking.seatNumbers.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase">Total Paid</span>
                      <p className="font-bold text-lg text-slate-800">₹ {booking.totalPrice}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-16 rounded-3xl border border-dashed text-center">
                <p className="text-slate-400">You haven't booked any tickets yet.</p>
                <button 
                  onClick={() => setActiveTab('search')}
                  className="mt-4 text-indigo-600 font-semibold hover:underline"
                >
                  Start searching for trains
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
