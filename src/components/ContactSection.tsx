
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get in{" "}
            <span className="bg-gradient-to-r from-[#00F5D4] to-[#00D4AA] bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? Need support? We're here to help you 24/7
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input placeholder="Your phone" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Needed
                  </label>
                  <Input placeholder="What service do you need?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input placeholder="Your area/city" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea placeholder="Tell us more about your requirements" rows={4} />
                </div>
                <Button className="w-full bg-[#00F5D4] hover:bg-[#00D4AA] text-white py-3">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#00F5D4]/10 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <p className="text-gray-600">+91-9876543210</p>
                    <p className="text-sm text-gray-500">24/7 Support Available</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#00F5D4]/10 rounded-xl flex items-center justify-center mr-4">
                    <MessageSquare className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                    <p className="text-gray-600">+91-9876543210</p>
                    <p className="text-sm text-gray-500">Instant booking support</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#00F5D4]/10 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <p className="text-gray-600">support@simplifixr.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-[#00F5D4]/10 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-[#00F5D4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Headquarters</h4>
                    <p className="text-gray-600">Agartala, Tripura</p>
                    <p className="text-sm text-gray-500">Serving pan-India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-[#00F5D4] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp Booking
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Missed Call Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
