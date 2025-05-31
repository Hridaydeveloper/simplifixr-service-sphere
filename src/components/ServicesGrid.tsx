import { Home, Wrench, GraduationCap, Heart, Truck, PartyPopper, Sparkles, Car, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
const ServicesGrid = () => {
  const navigate = useNavigate();
  const services = [{
    icon: Sparkles,
    title: "Cleaning & Sanitation",
    description: "Deep cleaning, bathroom, kitchen & more",
    color: "bg-blue-50 text-blue-600"
  }, {
    icon: Wrench,
    title: "Repairs & Maintenance",
    description: "Plumbing, electrical, AC & appliances",
    color: "bg-orange-50 text-orange-600"
  }, {
    icon: GraduationCap,
    title: "Education & Tech",
    description: "Home tutoring, tech support & training",
    color: "bg-purple-50 text-purple-600"
  }, {
    icon: Heart,
    title: "Healthcare & Wellness",
    description: "Nursing, physiotherapy, salon at home",
    color: "bg-pink-50 text-pink-600"
  }, {
    icon: PartyPopper,
    title: "Events & Religious",
    description: "Puja services, party helpers & catering",
    color: "bg-yellow-50 text-yellow-600"
  }, {
    icon: Truck,
    title: "Logistics & Moving",
    description: "Packers & movers, delivery services",
    color: "bg-green-50 text-green-600"
  }, {
    icon: Car,
    title: "Automotive",
    description: "Car wash, detailing & maintenance",
    color: "bg-red-50 text-red-600"
  }, {
    icon: Smartphone,
    title: "Device Repair",
    description: "Mobile, laptop & electronics repair",
    color: "bg-indigo-50 text-indigo-600"
  }];
  const handleServiceClick = () => {
    navigate('/services');
  };
  return <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            All Services in{" "}
            <span className="bg-gradient-to-r from-[#00D4AA] to-[#00F5D4] bg-clip-text text-teal-500">
              One Place
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From everyday tasks to specialized services, find verified professionals for every need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => <Card key={index} className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-0 shadow-md" onClick={handleServiceClick}>
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </CardContent>
            </Card>)}
        </div>

        <div className="text-center mt-12">
          <button onClick={handleServiceClick} className="font-semibold transition-colors text-teal-500">
            View All Services →
          </button>
        </div>
      </div>
    </section>;
};
export default ServicesGrid;