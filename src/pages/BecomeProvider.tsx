
import { useState } from "react";
import { Camera, MapPin, Clock, Upload, DollarSign, FileText, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const BecomeProvider = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [serviceTitle, setServiceTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [fixedPrice, setFixedPrice] = useState("");
  const [priceRangeMin, setPriceRangeMin] = useState("");
  const [priceRangeMax, setPriceRangeMax] = useState("");
  const [quoteAfterInspection, setQuoteAfterInspection] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [location, setLocation] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  const categories = [
    { name: "Cleaning & Sanitation", subcategories: ["Deep Cleaning", "Bathroom Cleaning", "Kitchen Cleaning"] },
    { name: "Repairs & Maintenance", subcategories: ["Plumbing", "Electrical", "AC Repair", "Appliance Repair"] },
    { name: "Education & Tech", subcategories: ["Home Tutoring", "Tech Support", "Training"] },
    { name: "Healthcare & Wellness", subcategories: ["Nursing", "Physiotherapy", "Salon at Home"] },
    { name: "Events & Religious", subcategories: ["Puja Services", "Party Helpers", "Catering"] },
    { name: "Logistics & Moving", subcategories: ["Packers & Movers", "Delivery Services"] },
    { name: "Automotive", subcategories: ["Car Wash", "Detailing", "Maintenance"] },
    { name: "Device Repair", subcategories: ["Mobile Repair", "Laptop Repair", "Electronics"] }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).slice(0, 5 - images.length).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === Math.min(files.length, 5 - images.length)) {
              setImages(prev => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Service submitted:", {
      images,
      serviceTitle,
      description,
      priceType,
      fixedPrice,
      priceRangeMin,
      priceRangeMax,
      quoteAfterInspection,
      category,
      subcategory,
      location,
      workingHours,
      documents
    });
    alert("Service submitted for review!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            onClick={() => navigate('/')}
            variant="outline" 
            className="mb-8 border-[#00B896] text-[#00B896] hover:bg-[#00B896] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Got a Skill or Service to Offer?{" "}
              <span className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] bg-clip-text text-transparent">
                Join Simplifixr
              </span>{" "}
              and Start Earning Today!
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simplifixr empowers skilled individuals, small businesses, and service providers to connect with local customers who need your expertise. Whether you're a plumber, yoga trainer, makeup artist, or space owner — list your services and get discovered by thousands nearby.
            </p>
          </div>

          <div className="space-y-8">
            {/* Image Upload Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Camera className="w-5 h-5 text-[#00B896] mr-2" />
                  <h3 className="text-lg font-semibold">Upload Service Images</h3>
                </div>
                <p className="text-gray-600 mb-4">Upload up to 5 high-quality images of your service or past work.</p>
                
                {images.length > 0 && (
                  <div className="relative mb-4">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={images[currentImageIndex]} 
                        alt={`Service ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="absolute inset-y-0 flex items-center justify-between w-full px-4">
                        <Button
                          onClick={prevImage}
                          variant="outline"
                          size="icon"
                          className="bg-white/80 hover:bg-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={nextImage}
                          variant="outline"
                          size="icon"
                          className="bg-white/80 hover:bg-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-2">
                        {images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-[#00B896]' : 'bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#00B896] file:text-white hover:file:bg-[#009985]"
                  disabled={images.length >= 5}
                />
                <p className="text-sm text-gray-500 mt-2">{images.length}/5 images uploaded</p>
              </CardContent>
            </Card>

            {/* Service Title & Description */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-[#00B896] mr-2" />
                  <h3 className="text-lg font-semibold">Service Title & Description</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Title
                    </label>
                    <Input
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      placeholder="e.g., AC Repair in Andheri, Home Tutor for Class 10"
                      className="focus:border-[#00B896] focus:ring-[#00B896]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide detailed info about your service, experience, areas you serve, and what makes you reliable."
                      rows={4}
                      className="focus:border-[#00B896] focus:ring-[#00B896]/20"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <DollarSign className="w-5 h-5 text-[#00B896] mr-2" />
                  <h3 className="text-lg font-semibold">Set Your Price</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="fixed"
                        checked={priceType === "fixed"}
                        onChange={(e) => setPriceType(e.target.value)}
                        className="mr-2"
                      />
                      Fixed Price (₹)
                    </label>
                    {priceType === "fixed" && (
                      <Input
                        value={fixedPrice}
                        onChange={(e) => setFixedPrice(e.target.value)}
                        placeholder="Enter fixed price"
                        type="number"
                        className="ml-6 max-w-xs focus:border-[#00B896] focus:ring-[#00B896]/20"
                      />
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="range"
                        checked={priceType === "range"}
                        onChange={(e) => setPriceType(e.target.value)}
                        className="mr-2"
                      />
                      Price Range
                    </label>
                    {priceType === "range" && (
                      <div className="ml-6 flex space-x-2 max-w-md">
                        <Input
                          value={priceRangeMin}
                          onChange={(e) => setPriceRangeMin(e.target.value)}
                          placeholder="Min price"
                          type="number"
                          className="focus:border-[#00B896] focus:ring-[#00B896]/20"
                        />
                        <span className="flex items-center">to</span>
                        <Input
                          value={priceRangeMax}
                          onChange={(e) => setPriceRangeMax(e.target.value)}
                          placeholder="Max price"
                          type="number"
                          className="focus:border-[#00B896] focus:ring-[#00B896]/20"
                        />
                      </div>
                    )}
                  </div>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quoteAfterInspection}
                      onChange={(e) => setQuoteAfterInspection(e.target.checked)}
                      className="mr-2"
                    />
                    Quote After Inspection
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Category Selection */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Category & Subcategory</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("");
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-[#00B896] focus:ring-[#00B896]/20"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:border-[#00B896] focus:ring-[#00B896]/20"
                      disabled={!category}
                    >
                      <option value="">Select Subcategory</option>
                      {category &&
                        categories
                          .find((cat) => cat.name === category)
                          ?.subcategories.map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-[#00B896] mr-2" />
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Add your service location (city, area, pin code)"
                  className="focus:border-[#00B896] focus:ring-[#00B896]/20"
                />
              </CardContent>
            </Card>

            {/* Availability Schedule */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-[#00B896] mr-2" />
                  <h3 className="text-lg font-semibold">Availability Schedule (Optional)</h3>
                </div>
                <Input
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="e.g., Mon–Sat, 10 AM – 7 PM"
                  className="focus:border-[#00B896] focus:ring-[#00B896]/20"
                />
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Upload className="w-5 h-5 text-[#00B896] mr-2" />
                  <h3 className="text-lg font-semibold">Upload Documents (Optional but Recommended)</h3>
                </div>
                <p className="text-gray-600 mb-4">Upload ID proof or certifications for faster verification and higher trust.</p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocuments(Array.from(e.target.files || []))}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#00B896] file:text-white hover:file:bg-[#009985]"
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="text-center">
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#00B896] to-[#00C9A7] hover:from-[#009985] hover:to-[#00B896] px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
              >
                List My Service Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BecomeProvider;
