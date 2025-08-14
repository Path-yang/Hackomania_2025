"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  tags: string[];
}

interface Resource {
  title: string;
  description: string;
  url: string;
  icon: string;
}

export default function CommunityPage() {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState<"forum" | "resources">("forum");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    
    // Check if user has profile
    try {
      const userData = localStorage.getItem("nofap_user");
      if (!userData) {
        console.log("No user data found, redirecting to profile");
        window.location.href = "/profile";
        return;
      }
      
      try {
        const user = JSON.parse(userData || "{}");
        setUsername(user.username || "");
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
      
      // Load sample posts
      loadSamplePosts();
      
      // Load resources
      loadResources();
    } catch (e) {
      console.error("Error checking user data:", e);
      window.location.href = "/profile";
    }
  }, []);
  
  function loadSamplePosts() {
    // These are sample posts that simulate a community
    const samplePosts: Post[] = [
      {
        id: "post1",
        author: "RecoveryChampion",
        title: "How I reached 90 days - my journey and tips",
        content: "I finally hit the 90-day mark after several attempts. The key for me was replacing the habit with exercise and meditation. Every time I felt an urge...",
        likes: 42,
        comments: 15,
        date: "2 days ago",
        tags: ["Success Story", "90 Days"]
      },
      {
        id: "post2",
        author: "NewBeginnings",
        title: "Starting my journey today - any advice?",
        content: "After years of struggling, I'm finally committing to this journey. I've tried before but never made it past a week. Any tips for a beginner?",
        likes: 28,
        comments: 23,
        date: "5 days ago",
        tags: ["Beginner", "Advice"]
      },
      {
        id: "post3",
        author: "MindfulProgress",
        title: "Meditation techniques that helped me",
        content: "I wanted to share some meditation techniques that have been game-changers for me. Mindfulness meditation has been particularly helpful when dealing with urges...",
        likes: 56,
        comments: 12,
        date: "1 week ago",
        tags: ["Meditation", "Techniques"]
      },
      {
        id: "post4",
        author: "HealthyHabits",
        title: "Physical exercise as a replacement habit",
        content: "I've found that intense exercise is one of the best ways to redirect energy and reduce urges. Here's my workout routine that's been helping me stay on track...",
        likes: 37,
        comments: 8,
        date: "2 weeks ago",
        tags: ["Exercise", "Habits"]
      },
      {
        id: "post5",
        author: "RelationshipHealing",
        title: "How recovery improved my relationship",
        content: "I want to share how my relationship has transformed since starting this journey. The increased emotional connection and trust have been incredible...",
        likes: 64,
        comments: 19,
        date: "3 weeks ago",
        tags: ["Relationships", "Benefits"]
      }
    ];
    
    setPosts(samplePosts);
  }
  
  function loadResources() {
    const resourcesList: Resource[] = [
      {
        title: "Your Brain On Porn",
        description: "Scientific research and personal accounts on how pornography affects the brain.",
        url: "https://www.yourbrainonporn.com/",
        icon: "🧠"
      },
      {
        title: "NoFap Official",
        description: "Community-based porn recovery site with forums, articles, and support.",
        url: "https://nofap.com/",
        icon: "👥"
      },
      {
        title: "EasyPeasy Method",
        description: "A free ebook that takes a unique approach to breaking the habit.",
        url: "https://easypeasymethod.org/",
        icon: "📚"
      },
      {
        title: "Fortify Program",
        description: "Science-based recovery program with progress tracking and education.",
        url: "https://www.joinfortify.com/",
        icon: "🛡️"
      },
      {
        title: "Reboot Nation",
        description: "Forum and resources focused on recovery and rebooting from porn addiction.",
        url: "https://rebootnation.org/",
        icon: "🔄"
      },
      {
        title: "Fight The New Drug",
        description: "Non-religious organization raising awareness on porn's harmful effects.",
        url: "https://fightthenewdrug.org/",
        icon: "✊"
      }
    ];
    
    setResources(resourcesList);
  }
  
  function likePost(postId: string) {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  }

  // Show loading state when client-side code hasn't run yet
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-center">Community</h1>
      <p className="text-center text-gray-600 mb-8">Connect with others on the same journey</p>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === "forum" 
              ? "border-b-2 border-purple-600 text-purple-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("forum")}
        >
          Forum
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === "resources" 
              ? "border-b-2 border-purple-600 text-purple-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </button>
      </div>
      
      {activeTab === "forum" ? (
        <div>
          {/* New Post Box */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-medium mb-4">Share Your Thoughts</h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`What's on your mind, ${username}?`}
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Post
              </button>
            </div>
          </div>
          
          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="font-medium text-gray-700">{post.author}</span>
                      <span className="mx-2">•</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <button 
                    className="flex items-center hover:text-purple-600"
                    onClick={() => likePost(post.id)}
                  >
                    <span className="mr-1">👍</span> {post.likes} likes
                  </button>
                  <span className="mx-3">•</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Resources List */}
          <div className="grid md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <a 
                key={index} 
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{resource.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{resource.title}</h3>
                    <p className="text-gray-600 mt-1">{resource.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {/* Tips Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Tips for Success</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Replace, don't just remove:</strong> Find healthy activities to fill the void.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Exercise regularly:</strong> Physical activity helps reduce urges and improves mood.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Practice mindfulness:</strong> Learn to observe urges without acting on them.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Stay connected:</strong> Isolation can trigger relapse; maintain healthy relationships.</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span><strong>Track your progress:</strong> Celebrate milestones and learn from setbacks.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 