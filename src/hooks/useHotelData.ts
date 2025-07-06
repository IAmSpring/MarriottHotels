import { useQuery, useMutation } from '@apollo/client';
import { GET_HOTELS, GET_HOTEL, CREATE_BOOKING, CREATE_REVIEW } from '../graphql/queries';

export const useHotelData = () => {
  const { data: hotelsData, loading: hotelsLoading, error: hotelsError } = useQuery(GET_HOTELS);

  const getHotel = (id: string) => {
    return useQuery(GET_HOTEL, {
      variables: { id },
    });
  };

  const [createBooking, { loading: bookingLoading }] = useMutation(CREATE_BOOKING);
  const [createReview, { loading: reviewLoading }] = useMutation(CREATE_REVIEW);

  const handleCreateBooking = async (bookingData: any) => {
    try {
      const { data } = await createBooking({
        variables: {
          input: bookingData,
        },
      });
      return data.createBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const handleCreateReview = async (reviewData: any) => {
    try {
      const { data } = await createReview({
        variables: {
          input: reviewData,
        },
      });
      return data.createReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  };

  return {
    hotels: hotelsData?.hotels || [],
    hotelsLoading,
    hotelsError,
    getHotel,
    createBooking: handleCreateBooking,
    createReview: handleCreateReview,
    bookingLoading,
    reviewLoading,
  };
}; 