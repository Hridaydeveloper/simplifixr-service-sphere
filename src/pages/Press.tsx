
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Press = () => {
  const navigate = useNavigate();

  const pressReleases = [
    {
      title: "Simplifixr Expands Services to Rural Areas",
      date: "January 20, 2025",
      summary: "Local service platform brings trusted professionals to underserved communities."
    },
    {
      title: "Partnership with Local Training Centers",
      date: "December 15, 2024", 
      summary: "Simplifixr announces skill development programs for service providers."
    },
    {
      title: "Platform Launches in Tripura",
      date: "November 10, 2024",
      summary: "Simplifixr officially launches operations in Agartala and surrounding areas."
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Press Center</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Latest news and updates from Simplifixr
              </p>
            </div>
            
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Press Releases</h2>
                <div className="space-y-6">
                  {pressReleases.map((release, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{release.title}</h3>
                            <p className="text-gray-600 mb-4">{release.summary}</p>
                            <p className="text-sm text-gray-500">{release.date}</p>
                          </div>
                          <Button variant="outline" size="sm" className="ml-4 border-[#008B73] text-[#008B73] hover:bg-[#008B73] hover:text-white">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Read Full
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Media Kit</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Download our brand assets, logos, and company information for media use.
                    </p>
                    <Button className="w-full bg-gradient-to-r from-[#008B73] to-[#00A085] hover:from-[#007A66] hover:to-[#009173]">
                      <Download className="w-4 h-4 mr-2" />
                      Download Media Kit
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Media Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-gray-900">Press Inquiries</p>
                      <p className="text-gray-600">press@simplifixr.com</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+91-9876543210</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Press;
