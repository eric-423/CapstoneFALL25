'use client';

import { sampleData } from '@/data';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Sample Data Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-bold">📦 Products</h2>
          <p>Count: {sampleData.products.length}</p>
          <p>First: {sampleData.products[0]?.productName}</p>
        </div>
        
        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-bold">👥 Users</h2>
          <p>Count: {sampleData.users.length}</p>
          <p>First: {sampleData.users[0]?.fullName}</p>
        </div>
        
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-bold">🏪 Branches</h2>
          <p>Count: {sampleData.branches.length}</p>
          <p>First: {sampleData.branches[0]?.branchName}</p>
        </div>
        
        <div className="bg-purple-100 p-4 rounded">
          <h2 className="font-bold">🥘 Ingredients</h2>
          <p>Count: {sampleData.ingredients.length}</p>
          <p>First: {sampleData.ingredients[0]?.name}</p>
        </div>
        
        <div className="bg-pink-100 p-4 rounded">
          <h2 className="font-bold">📚 Recipes</h2>
          <p>Count: {sampleData.recipes.length}</p>
          <p>First: {sampleData.recipes[0]?.name}</p>
        </div>
        
        <div className="bg-orange-100 p-4 rounded">
          <h2 className="font-bold">🎓 Training</h2>
          <p>Count: {sampleData.trainingCourses.length}</p>
          <p>First: {sampleData.trainingCourses[0]?.name}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">🍛 Sample Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleData.products.slice(0, 6).map((product) => (
            <div key={product.productId} className="bg-white p-4 border rounded shadow">
              <h3 className="font-bold">{product.productName}</h3>
              <p className="text-gray-600">{product.productDescription}</p>
              <p className="text-green-600 font-bold">{product.productPrice.toLocaleString()}đ</p>
              <p className="text-yellow-500">⭐ {product.rating}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
