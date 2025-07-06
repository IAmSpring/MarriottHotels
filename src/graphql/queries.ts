import { gql } from '@apollo/client';

export const GET_HOTELS = gql`
  query GetHotels {
    hotels {
      id
      name
      type
      location
      description
      price {
        base
        currency
      }
      rating
      reviews
      image
      amenities
    }
  }
`;

export const GET_HOTEL = gql`
  query GetHotel($id: ID!) {
    hotel(id: $id) {
      id
      name
      type
      location
      description
      price {
        base
        currency
      }
      rating
      reviews
      image
      amenities
      rooms {
        id
        type
        price
        description
        beds
        occupancy
        size
      }
    }
  }
`;

export const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: ID!) {
    userBookings(userId: $userId) {
      id
      hotelId
      roomId
      checkIn
      checkOut
      guests
      totalPrice
      status
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      id
      userId
      hotelId
      roomId
      checkIn
      checkOut
      guests
      totalPrice
      status
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
      id
      userId
      hotelId
      rating
      comment
      createdAt
      updatedAt
      user {
        name
      }
    }
  }
`;

export const GET_HOTEL_EXPERIENCES = gql`
  query GetHotelExperiences($hotelId: String!) {
    experiences(hotelId: $hotelId) {
      id
      name
      type
      description
      price
      duration
      imageUrl
      available
    }
  }
`;

export const GET_HOTEL_RESTAURANTS = gql`
  query GetHotelRestaurants($hotelId: String!) {
    restaurants(hotelId: $hotelId) {
      id
      name
      cuisine
      priceRange
      openTime
      closeTime
      description
      imageUrl
    }
  }
`;

export const GET_USER_CONVERSATIONS = gql`
  query GetUserConversations($userId: Int!) {
    conversations(userId: $userId) {
      id
      userMessage
      aiResponse
      threadId
      timestamp
    }
  }
`; 