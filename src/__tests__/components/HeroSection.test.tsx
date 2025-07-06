import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from '../../components/HeroSection';

describe('HeroSection', () => {
  it('renders without crashing', () => {
    render(<HeroSection />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/welcome to marriott hotels/i);
  });

  it('shows search form with location input', () => {
    render(<HeroSection />);
    expect(screen.getByPlaceholderText(/where would you like to go/i)).toBeInTheDocument();
  });

  it('handles search submission', async () => {
    const mockSubmit = jest.fn();
    render(<HeroSection onSearch={mockSubmit} />);

    const locationInput = screen.getByPlaceholderText(/where would you like to go/i);
    await userEvent.type(locationInput, 'Miami Beach');
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    await userEvent.click(searchButton);

    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      location: 'Miami Beach'
    }));
  });

  it('displays background image', () => {
    render(<HeroSection />);
    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toHaveStyle({
      backgroundImage: expect.stringContaining('miami-beach.jpg')
    });
  });

  it('is accessible', async () => {
    const { container } = render(<HeroSection />);
    expect(container).toBeAccessible();
  });
}); 