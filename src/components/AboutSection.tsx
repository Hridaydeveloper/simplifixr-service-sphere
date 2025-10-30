
import { Users, Target, Heart, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const stats = [
    {
      number: "10K+",
      label: "Happy Customers"
    },
    {
      number: "2K+", 
      label: "Verified Providers"
    },
    {
      number: "50+",
      label: "Service Categories"
    },
    {
      number: "4.9",
      label: "Average Rating"
    }
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
    <section id="about" className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Empowering the{" "}
            <span className="text-gradient">
              Invisible Workforce
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born in Agartala, Simplifixr bridges the gap between skilled service providers and customers who need them. We believe every service provider deserves dignity, fair wages, and a digital identity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 glow-effect">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-border/50 hover:border-primary/50 glow-effect-hover">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Dignity First</h3>
              <p className="text-muted-foreground">
                Every service provider deserves respect, fair wages, and professional recognition
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border/50 hover:border-primary/50 glow-effect-hover">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Simplicity</h3>
              <p className="text-muted-foreground">
                Making it easy for anyone to book services or offer their skills
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-border/50 hover:border-primary/50 glow-effect-hover">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 glow-effect">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Trust</h3>
              <p className="text-muted-foreground">
                Verified providers, secure payments, and reliable service quality
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Team */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">Meet Team Simplify</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 glow-effect-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center glow-effect">
                    <Users className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-1">{member.name}</h4>
                  <div className="text-primary font-medium mb-3">{member.role}</div>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
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
