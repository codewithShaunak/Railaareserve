
import React from 'react';
import { Train, SeatStatus, Seat } from '../types';

interface SeatSelectorProps {
  train: Train;
  selectedSeats: string[];
  onToggleSeat: (seatNumber: string) => void;
  onBook: () => void;
  onCancel: () => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ train, selectedSeats, onToggleSeat, onBook, onCancel }) => {
  const getStatusColor = (status: SeatStatus, isSelected: boolean) => {
    if (isSelected) return 'bg-indigo-600 text-white hover:bg-indigo-700';
    switch (status) {
      case SeatStatus.AVAILABLE: return 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-400';
      case SeatStatus.BOOKED: return 'bg-slate-200 text-slate-400 cursor-not-allowed';
      case SeatStatus.RESERVED: return 'bg-amber-100 text-amber-600 border-2 border-amber-200 cursor-not-allowed';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{train.name}</h2>
          <p className="text-sm text-slate-500">Choose your preferred seats</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {train.seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.number);
          const isDisabled = seat.status !== SeatStatus.AVAILABLE;
          
          return (
            <button
              key={seat.id}
              disabled={isDisabled}
              onClick={() => onToggleSeat(seat.number)}
              className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center h-12 w-full ${getStatusColor(seat.status, isSelected)}`}
            >
              {seat.number}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mb-8 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-slate-300"></div> Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-200"></div> Booked
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-100"></div> Reserved
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-600"></div> Selected
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-500">Selected: {selectedSeats.length} Seats</span>
          <span className="text-lg font-bold text-indigo-700">₹ {selectedSeats.length * train.price}</span>
        </div>
        <button
          disabled={selectedSeats.length === 0}
          onClick={onBook}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;
