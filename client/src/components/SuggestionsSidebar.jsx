import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const SuggestionsSidebar = () => {
  return (
    <div className="space-y-6"> 
      {/* Trending Tags Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Trending Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {/* Example Trending Tags*/}
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">#ReactJS</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">#WebDev</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">#AI</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">#Backend</span>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">#Security</span>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Users/Recommendations Section */}
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

      {/* Optional: Other sections like "Popular Posts" */}
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