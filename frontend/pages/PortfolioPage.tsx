import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PortfolioPage() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with advanced features",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
      category: "Web Development",
      results: ["300% increase in sales", "50% faster load times", "99.9% uptime"],
      link: "#",
      github: "#"
    },
    {
      title: "Healthcare Dashboard",
      description: "Comprehensive patient management system",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      tags: ["Vue.js", "Express", "MongoDB", "Chart.js"],
      category: "UI/UX Design",
      results: ["40% reduction in admin time", "Improved patient satisfaction", "HIPAA compliant"],
      link: "#",
      github: "#"
    },
    {
      title: "FinTech Mobile App",
      description: "Secure financial management application",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      tags: ["React Native", "Firebase", "Plaid API", "Biometrics"],
      category: "Mobile Development",
      results: ["10k+ downloads", "4.8 app store rating", "Bank-level security"],
      link: "#",
      github: "#"
    },
    {
      title: "Restaurant Chain Website",
      description: "Multi-location restaurant website with online ordering",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
      tags: ["Next.js", "Tailwind", "Sanity CMS", "Stripe"],
      category: "Web Development",
      results: ["200% increase in online orders", "Mobile-first design", "SEO optimized"],
      link: "#",
      github: "#"
    },
    {
      title: "SaaS Analytics Platform",
      description: "Real-time analytics dashboard for businesses",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["React", "D3.js", "Python", "AWS"],
      category: "Web Development",
      results: ["Real-time data processing", "Custom visualizations", "Scalable architecture"],
      link: "#",
      github: "#"
    },
    {
      title: "Educational Platform",
      description: "Online learning platform with interactive courses",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      tags: ["Angular", "NestJS", "PostgreSQL", "WebRTC"],
      category: "Web Development",
      results: ["5000+ active students", "Interactive video lessons", "Progress tracking"],
      link: "#",
      github: "#"
    }
  ];

  const categories = ["All", "Web Development", "UI/UX Design", "Mobile Development", "Branding"];

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
              Our Portfolio
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Showcasing our best work and the impact we've created for our clients
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "bg-[#001F3F] hover:bg-[#002a5c]" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="relative group">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      <Button size="sm" variant="secondary" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </a>
                      </Button>
                      <Button size="sm" variant="secondary" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <Badge className="mb-3 bg-[#001F3F] hover:bg-[#002a5c]">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-semibold text-[#001F3F] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-[#001F3F]">Results:</h4>
                      {project.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          {result}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#001F3F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Create Something Amazing?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let's discuss your project and bring your vision to life.
            </p>
            <Button asChild size="lg" className="bg-white text-[#001F3F] hover:bg-gray-100">
              <a href="/contact">
                Start Your Project
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
