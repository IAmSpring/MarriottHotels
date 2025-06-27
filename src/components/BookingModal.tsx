import React, { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import type { Room } from '../types/hotel';
import { hotels } from '../data/hotels';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: typeof hotels[0];
  selectedRoom?: Room;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, hotel, selectedRoom }) => {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);

  if (!isOpen) return null;

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return days * selectedRoom.price;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle booking submission
    console.log({
      hotel: hotel.name,
      room: selectedRoom?.type,
      checkIn,
      checkOut,
      guests,
      totalPrice: calculateTotalPrice()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Check-in Date
            </label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              className="w-full p-2 border rounded"
              minDate={new Date()}
              placeholderText="Select check-in date"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Check-out Date
            </label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              className="w-full p-2 border rounded"
              minDate={checkIn || new Date()}
              placeholderText="Select check-out date"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              min="1"
              max={selectedRoom ? parseInt(selectedRoom.occupancy.split(' ')[0]) : 1}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {selectedRoom && (
            <div className="mb-4">
              <h3 className="font-bold mb-2">Selected Room</h3>
              <p>{selectedRoom.type}</p>
              <p className="text-gray-600">{selectedRoom.description}</p>
              <p className="text-xl font-bold mt-2">
                Total: ${calculateTotalPrice()}
                <span className="text-sm font-normal text-gray-500">
                  {checkIn && checkOut
                    ? ` for ${Math.ceil(
                        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
                      )} nights`
                    : ''}
                </span>
              </p>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B1538] text-white rounded hover:bg-[#6B1028]"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 