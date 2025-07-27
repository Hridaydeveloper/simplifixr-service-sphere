
import { useState } from "react";
import { Heart, Users, Target, Zap, Gift, CreditCard, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import skillDevelopment from "@/assets/skill-development.jpg";
import toolsEquipment from "@/assets/tools-equipment.jpg";
import emergencySupport from "@/assets/emergency-support.jpg";

const HelpCommunity = () => {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');

  const predefinedAmounts = [100, 500, 1000, 2000, 5000];

  const impactStats = [
    { icon: Users, value: '10,000+', label: 'Service providers supported' },
    { icon: Target, value: '50,000+', label: 'Jobs created' },
    { icon: Zap, value: '₹2Cr+', label: 'Earnings generated' },
    { icon: Gift, value: '1,000+', label: 'Families helped' }
  ];

  const campaigns = [
    {
      id: 1,
      title: 'Skill Development Program',
      description: 'Help us train 1000 service providers with new skills and digital literacy',
      target: 500000,
      raised: 325000,
      donors: 234,
      image: skillDevelopment
    },
    {
      id: 2,
      title: 'Tools & Equipment Fund',
      description: 'Provide essential tools and equipment to new service providers',
      target: 300000,
      raised: 180000,
      donors: 156,
      image: toolsEquipment
    },
    {
      id: 3,
      title: 'Emergency Support Fund',
      description: 'Support service providers during emergencies and difficult times',
      target: 200000,
      raised: 145000,
      donors: 98,
      image: emergencySupport
    }
  ];

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setDonationAmount('');
  };

  const handleDonate = () => {
    const amount = donationAmount || customAmount;
    if (amount && donorName && donorEmail) {
      // TODO: Integrate with payment gateway
      alert(`Thank you for your donation of ₹${amount}! Redirecting to payment...`);
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Our{" "}
              <span className="bg-gradient-to-r from-[#00C9A7] to-[#00B896] bg-clip-text text-transparent">
                Community
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your support helps us empower service providers, create opportunities, 
              and build a stronger community together.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#00C9A7]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-[#00C9A7]" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Make a Donation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Amount
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {predefinedAmounts.map(amount => (
                        <Button
                          key={amount}
                          variant={donationAmount === amount.toString() ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAmountSelect(amount)}
                          className={donationAmount === amount.toString() ? "bg-[#00B896] hover:bg-[#00A085]" : ""}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                    <Input
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      type="number"
                    />
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <Input
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message (Optional)
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave a message of support"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credit/Debit Card
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Smartphone className="w-4 h-4 mr-2" />
                        UPI Payment
                      </Button>
                    </div>
                  </div>

                  <Button 
                    onClick={handleDonate}
                    className="w-full bg-[#00B896] hover:bg-[#00A085] text-white"
                    size="lg"
                  >
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Campaigns</h2>
              <div className="space-y-6">
                {campaigns.map(campaign => (
                  <Card key={campaign.id}>
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={campaign.image}
                          alt={campaign.title}
                          className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {campaign.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>₹{campaign.raised.toLocaleString()} raised</span>
                            <span>₹{campaign.target.toLocaleString()} goal</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#00B896] h-2 rounded-full"
                              style={{ width: `${(campaign.raised / campaign.target) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="secondary">
                              {campaign.donors} donors
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {Math.round((campaign.raised / campaign.target) * 100)}% funded
                            </span>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          className="border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white"
                        >
                          Support This Campaign
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCommunity;
