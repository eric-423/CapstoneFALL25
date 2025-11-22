import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';

// Mock http utility
jest.mock('@/utils/http', () => ({
  get: jest.fn(),
}));

describe('/api/products', () => {
  it('should return products successfully', async () => {
    const mockProducts = {
      data: {
        content: [
          { id: 1, name: 'Cơm tấm sườn nướng', price: 35000 },
          { id: 2, name: 'Cơm tấm bì', price: 30000 },
        ],
        totalElements: 2,
        totalPages: 1,
      },
    };

    require('@/utils/http').get.mockResolvedValue(mockProducts);

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockProducts.data);
  });

  it('should handle API errors', async () => {
    require('@/utils/http').get.mockRejectedValue(new Error('API Error'));

    const request = new NextRequest('http://localhost:3000/api/products');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch products');
  });

  it('should handle query parameters', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: { content: [] } });
    require('@/utils/http').get = mockGet;

    const request = new NextRequest('http://localhost:3000/api/products?page=1&size=10&typeId=2');
    await GET(request);

    expect(mockGet).toHaveBeenCalledWith('/products', {
      params: { page: '1', size: '10', typeId: '2' },
    });
  });
});
