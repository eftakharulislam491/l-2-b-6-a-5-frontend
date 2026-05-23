'use client'

import React, { useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import AppPagination from '@/components/shared/AppPagination';

interface WishlistItem {
  id: string;
  image: string;
  productName: string;
  price: number;
  availability: 'In Stock' | 'Out of Stock';
}

const initialItems: WishlistItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1556228852-80282d6336c2?w=500',
    productName: 'Apple 2023 iMac (24-inch)',
    price: 1349.00,
    availability: 'In Stock'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
    productName: 'Apple 2023 MacBook Pro (14-inch)',
    price: 1499.00,
    availability: 'In Stock'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
    productName: 'JVX Jeans for Men || Men Jeans || Men Jeans Pants || Denim Jeans',
    price: 68.00,
    availability: 'In Stock'
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1556228852-80282d6336c2?w=500',
    productName: 'MSI Gaming Core i7 8Th Gen 15.6-Inch Gaming Fhd Thin and Light Laptop',
    price: 760.00,
    availability: 'In Stock'
  }
];

export default function MyWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(initialItems);
  const [page, setPage] = useState<number>(5);

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
    // Add your cart logic here
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Availability</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img 
                        src={item.image} 
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{item.productName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-base font-semibold text-blue-600">
                      ${item.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      {item.availability}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>Your wishlist is empty</p>
          </div>
        )}
      </div>

      <div className='mt-8'>
        <AppPagination currentPage={5} totalPages={12} onPageChange={setPage} />
      </div>
    </div>
  );
}