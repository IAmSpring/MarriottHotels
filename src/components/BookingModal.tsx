import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { loadStripe } from '@stripe/stripe-js';
import { trpc } from '../utils/trpc';
import type { Hotel, Room, BookingDetails } from '../types/hotel';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || '');

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: Hotel;
  selectedRoom?: Room;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, hotel, selectedRoom }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    hotelId: hotel.id,
    roomType: selectedRoom?.type || hotel.rooms[0].type,
    checkIn: '',
    checkOut: '',
    guests: 2,
    totalPrice: selectedRoom?.price || hotel.rooms[0].price
  });

  const createBooking = trpc.createBooking.useMutation({
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.clientSecret
      });

      if (error) {
        console.error('Error:', error);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking.mutate(bookingDetails);
  };

  const calculateNights = () => {
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    const checkIn = new Date(bookingDetails.checkIn);
    const checkOut = new Date(bookingDetails.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = nights * bookingDetails.totalPrice;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>

            <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
              Book Your Stay
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <select
                  value={bookingDetails.roomType}
                  onChange={(e) => {
                    const room = hotel.rooms.find(r => r.type === e.target.value);
                    setBookingDetails(prev => ({
                      ...prev,
                      roomType: e.target.value,
                      totalPrice: room?.price || prev.totalPrice
                    }));
                  }}
                  className="w-full p-2 border rounded"
                >
                  {hotel.rooms.map((room) => (
                    <option key={room.type} value={room.type}>
                      {room.type} - ${room.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in Date
                  </label>
                  <DatePicker
                    selected={bookingDetails.checkIn ? new Date(bookingDetails.checkIn) : null}
                    onChange={(date) => setBookingDetails(prev => ({
                      ...prev,
                      checkIn: date?.toISOString() || ''
                    }))}
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
                    selected={bookingDetails.checkOut ? new Date(bookingDetails.checkOut) : null}
                    onChange={(date) => setBookingDetails(prev => ({
                      ...prev,
                      checkOut: date?.toISOString() || ''
                    }))}
                    minDate={bookingDetails.checkIn ? new Date(bookingDetails.checkIn) : new Date()}
                    className="w-full p-2 border rounded"
                    placeholderText="Select check-out date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  value={bookingDetails.guests}
                  onChange={(e) => setBookingDetails(prev => ({
                    ...prev,
                    guests: parseInt(e.target.value)
                  }))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Price per night</span>
                  <span>${bookingDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Number of nights</span>
                  <span>{nights}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={createBooking.isLoading || !bookingDetails.checkIn || !bookingDetails.checkOut}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBooking.isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default BookingModal; 