import React from 'react';

export default function BolsaSkeleton() {
  return (
    <main className="h-full w-full p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        {/* Skeleton for HeaderBolsa component */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chart section skeleton */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6 border-t-3 border-[#DB1515]">
            <div className="flex items-center mb-4">
              <div className="w-2 h-6 bg-[#DB1515] mr-3 rounded"></div>
              <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div style={{ height: '250px' }} className="relative bg-gray-100 animate-pulse rounded-lg"></div>
          </div>

          {/* Card section skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-3 border-[#DB1515]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="w-2 h-6 bg-[#DB1515] mr-3 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
            
            <div className="text-center mb-6">
              <div className="h-4 w-36 bg-gray-200 animate-pulse rounded mx-auto mb-2"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded mx-auto mt-2"></div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-300 h-2 rounded-full w-3/5"></div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gray-300 h-2 rounded-full w-2/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skeleton for table */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-[#DB1515] to-[#9E0B0F]">
                    {[...Array(8)].map((_, index) => (
                      <th key={index} className="px-6 py-4">
                        <div className="h-4 w-24 bg-[#f0585a] animate-pulse rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                      {[...Array(8)].map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                          <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}