
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Careers = () => {
  const navigate = useNavigate();

  const jobOpenings = [
    {
      title: "Frontend Developer",
      location: "Agartala, Tripura",
      type: "Full-time",
      description: "Join our tech team to build amazing user experiences"
    },
    {
      title: "Customer Success Manager",
      location: "Remote",
      type: "Full-time", 
      description: "Help our customers achieve success with our platform"
    },
    {
      title: "Business Development Associate",
      location: "Agartala, Tripura",
      type: "Full-time",
      description: "Drive growth and partnerships in local markets"
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Help us build the future of local services. We're looking for passionate individuals 
                who want to make a difference in communities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobOpenings.map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{job.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{job.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.type}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-[#008B73] to-[#00A085] hover:from-[#007A66] hover:to-[#009173]">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <Users className="w-12 h-12 text-[#008B73] mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Work With Us?</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
                  <p className="text-gray-600">Learn and grow with a fast-moving startup</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                  <p className="text-gray-600">Make a real difference in people's lives</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Culture</h3>
                  <p className="text-gray-600">Work with passionate, driven individuals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;
