import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Award, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "../contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Like the Orca's precise hunting techniques, we deliver exact solutions."
    },
    {
      icon: Zap,
      title: "Power",
      description: "Harnessing the strength of modern technology for maximum impact."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Working together as a pod to achieve extraordinary results."
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by genuine love for creating exceptional digital experiences."
    }
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Full-stack developer with 8+ years of experience in building scalable web applications."
    },
    {
      name: "Sarah Chen",
      role: "Lead Designer",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "UI/UX designer passionate about creating intuitive and beautiful user experiences."
    },
    {
      name: "Marcus Johnson",
      role: "Technical Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Backend specialist with expertise in cloud architecture and system optimization."
    },
    {
      name: "Elena Vasquez",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Agile project manager ensuring smooth delivery and client satisfaction."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#001F3F] to-[#002a5c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t("about.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#001F3F] mb-6">
                Why the Orca?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                The Orca, or Killer Whale, represents everything we stand for: intelligence, power, and precision. These magnificent creatures are apex predators not through brute force alone, but through strategic thinking, teamwork, and adaptability.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Just as Orcas dominate the ocean through their sophisticated hunting strategies and strong family bonds, we help businesses dominate the digital landscape through intelligent solutions and collaborative partnerships.
              </p>
              <p className="text-lg text-gray-600">
                {t("about.mission")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop"
                alt="Orca in the ocean"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-[#001F3F]/20 rounded-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#001F3F] mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-[#001F3F] rounded-full flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#001F3F] mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#001F3F] mb-4">
              Meet Our Pod
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The talented individuals behind Vorca Studio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-[#001F3F] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#001F3F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50+", label: "Happy Clients" },
              { number: "100+", label: "Projects Completed" },
              { number: "5+", label: "Years Experience" },
              { number: "99%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
