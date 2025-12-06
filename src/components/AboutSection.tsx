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

  const values = [
    {
      icon: Heart,
      title: "Dignity First",
      description: "Every service provider deserves respect, fair wages, and professional recognition"
    },
    {
      icon: Target,
      title: "Simplicity",
      description: "Making it easy for anyone to book services or offer their skills"
    },
    {
      icon: Award,
      title: "Trust",
      description: "Verified providers, secure payments, and reliable service quality"
    }
  ];

  return (
    <section id="about" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-full uppercase tracking-wide">
            About Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-display-sm font-bold text-foreground">
            Empowering the{" "}
            <span className="text-gradient">Invisible Workforce</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Born in Agartala, Simplifixr bridges the gap between skilled service providers and customers who need them. We believe every service provider deserves dignity, fair wages, and a digital identity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-card rounded-2xl border border-border/50 card-hover"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {values.map((value, index) => (
            <Card 
              key={index} 
              className="text-center bg-card border-border/50 hover:border-primary/30 transition-all duration-500 card-hover"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-10">
            Meet Team <span className="text-gradient">Simplify</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="bg-card border-border/50 hover:border-primary/30 transition-all duration-500 card-hover"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-5 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Users className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h4>
                  <div className="text-primary font-semibold mb-3">{member.role}</div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
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
