
import Navigation from "@/components/Navigation";
import ProfileSection from "@/components/ProfileSection";
import Footer from "@/components/Footer";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ProfileSection />
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
