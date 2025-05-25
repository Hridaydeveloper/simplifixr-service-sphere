
import { Users, Target, Heart, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "2K+", label: "Verified Providers" },
    { number: "50+", label: "Service Categories" },
    { number: "4.9", label: "Average Rating" }
  ];

  const team = [
    {
      name: "Dipanjan Das",
      role: "CEO & CMO",
      description: "Passionate about empowering local service providers"
    },
    {
      name: "Hriday Das", 
      role: "CTO & COO",
      description: "Building technology that connects communities"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Empowering the{" "}
            <span className="bg-gradient-to-r from-[#00F5D4] to-[#00D4AA] bg-clip-text text-transparent">
              Invisible Workforce
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Born in Agartala, Simplifixr bridges the gap between skilled service providers and customers who need them. We believe every service provider deserves dignity, fair wages, and a digital identity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#00F5D4] mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-[#00F5D4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-[#00F5D4]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Dignity First</h3>
              <p className="text-gray-600">
                Every service provider deserves respect, fair wages, and professional recognition
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-[#00F5D4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-[#00F5D4]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Simplicity</h3>
              <p className="text-gray-600">
                Making it easy for anyone to book services or offer their skills
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-[#00F5D4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-[#00F5D4]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Trust</h3>
              <p className="text-gray-600">
                Verified providers, secure payments, and reliable service quality
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Meet Team Simplify</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00F5D4] to-[#00D4AA] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h4>
                  <div className="text-[#00F5D4] font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
