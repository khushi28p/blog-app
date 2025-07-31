import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axiosInstance from '@/api/axios';
import { BACKEND_URL } from '@/config'; 
import { useSelector } from 'react-redux';

const SuggestionsSidebar = () => {
  const { token } = useSelector((state) => state.auth);
  const [trendingTags, setTrendingTags] = useState([]);

  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
  ];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get('/blog/trending-tags');
        setTrendingTags(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Trending Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trendingTags.length > 0 ? (
              trendingTags.map((tag, index) => (
                <span
                  key={tag.name || index} 
                  className={`px-3 py-1 text-sm font-medium rounded-full ${tagColors[index % tagColors.length]}`}
                >
                  #{tag.name || tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No trending tags available.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Who to Follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Example User Suggestions */}
          <div className="flex items-center gap-3">
            <img src="https://via.placeholder.com/40" alt="User 1" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-sm text-gray-600">@johndoe</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src="https://via.placeholder.com/40" alt="User 2" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">Jane Smith</p>
              <p className="text-sm text-gray-600">@janesmith</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Popular Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>Post title 1</li>
            <li>Post title 2</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuggestionsSidebar;