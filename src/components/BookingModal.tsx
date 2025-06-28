import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Hotel, Room } from '../data/hotels';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  selectedRoom?: Room;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, hotel, selectedRoom }) => {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(selectedRoom?.id || '');

  const currentRoom = selectedRoom || hotel.rooms.find(r => r.id === selectedRoomId);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (!currentRoom) {
      alert('Please select a room');
      return;
    }

    const booking = {
      hotelId: hotel.id,
      roomId: currentRoom.id,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      totalPrice: currentRoom.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    };

    console.log('Booking:', booking);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white p-6">
          <Dialog.Title className="text-2xl font-bold mb-4">
            Book Your Stay at {hotel.name}
          </Dialog.Title>

          <div className="space-y-4">
            {!selectedRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Room Type
                </label>
                <select
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Choose a room type</option>
                  {hotel.rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.type} - ${room.price}/night
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <DatePicker
                selected={checkIn}
                onChange={date => setCheckIn(date)}
                selectsStart
                startDate={checkIn}
                endDate={checkOut}
                minDate={new Date()}
                className="w-full p-2 border rounded"
                placeholderText="Select check-in date"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <DatePicker
                selected={checkOut}
                onChange={date => setCheckOut(date)}
                selectsEnd
                startDate={checkIn}
                endDate={checkOut}
                minDate={checkIn || new Date()}
                className="w-full p-2 border rounded"
                placeholderText="Select check-out date"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <input
                type="number"
                min={1}
                max={currentRoom ? parseInt(currentRoom.occupancy.split('-')[1] || '2') : 2}
                value={guests}
                onChange={e => setGuests(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>

            {currentRoom && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Room ({currentRoom.type})</span>
                  <span>${currentRoom.price}/night</span>
                </div>
                {checkIn && checkOut && (
                  <div className="flex justify-between font-semibold">
                    <span>Total ({Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
                    <span>${currentRoom.price * Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!currentRoom || !checkIn || !checkOut}
              className={`px-4 py-2 text-white rounded-lg ${!currentRoom || !checkIn || !checkOut ? 
                'bg-gray-400 cursor-not-allowed' : 
                'bg-[#8B1538] hover:bg-[#6d102c]'}`}
            >
              Book Now
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal; 