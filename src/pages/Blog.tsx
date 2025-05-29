
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      title: "How to Choose the Right Home Cleaning Service",
      excerpt: "Tips and tricks for finding reliable cleaning professionals in your area.",
      author: "Simplifixr Team",
      date: "January 15, 2025",
      image: "/placeholder.svg"
    },
    {
      title: "The Future of Local Services",
      excerpt: "Exploring how technology is transforming the way we access local services.",
      author: "Simplifixr Team", 
      date: "January 10, 2025",
      image: "/placeholder.svg"
    },
    {
      title: "Building Trust in the Gig Economy",
      excerpt: "How platforms like Simplifixr ensure safety and reliability for all users.",
      author: "Simplifixr Team",
      date: "January 5, 2025",
      image: "/placeholder.svg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="mb-8 border-[#008B73] text-[#008B73] hover:bg-[#008B73] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="space-y-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Simplifixr Blog</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, tips, and stories from the world of local services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <CardTitle className="text-xl text-gray-900 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full border-[#008B73] text-[#008B73] hover:bg-[#008B73] hover:text-white">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">Want to stay updated with our latest posts?</p>
              <Button className="bg-gradient-to-r from-[#008B73] to-[#00A085] hover:from-[#007A66] hover:to-[#009173]">
                Subscribe to Newsletter
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
