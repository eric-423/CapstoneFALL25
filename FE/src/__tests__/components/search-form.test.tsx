import { render, screen, fireEvent } from '@testing-library/react';
import { SearchForm } from '@/components/common/search-form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('SearchForm', () => {
  it('renders all form elements', () => {
    render(<SearchForm />);
    
    expect(screen.getByText('Chọn chi nhánh')).toBeInTheDocument();
    expect(screen.getByText('Thể loại món ăn')).toBeInTheDocument();
    expect(screen.getByText('Vị trí hiện tại')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tìm kiếm/i })).toBeInTheDocument();
  });

  it('handles form submission', () => {
    const mockPush = jest.fn();
    require('next/navigation').useRouter.mockReturnValue({
      push: mockPush,
    });

    render(<SearchForm />);
    
    const searchButton = screen.getByRole('button', { name: /tìm kiếm/i });
    fireEvent.click(searchButton);
    
    expect(mockPush).toHaveBeenCalledWith('/menu?');
  });

  it('updates form values when selections change', () => {
    render(<SearchForm />);
    
    // Test branch selection
    const branchSelect = screen.getByDisplayValue('');
    fireEvent.change(branchSelect, { target: { value: 'quan-1' } });
    
    expect(branchSelect).toHaveValue('quan-1');
  });
});
