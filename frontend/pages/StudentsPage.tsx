import { motion } from "framer-motion";
import { GraduationCap, Clock, DollarSign, CheckCircle, BookOpen, Code, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function StudentsPage() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Code,
      title: "Web Development Projects",
      description: "Complete website development for your assignments",
      price: "$150 - $500",
      features: ["HTML/CSS/JavaScript", "React/Vue.js", "Backend Integration", "Responsive Design"],
      duration: "3-7 days"
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Professional design for your projects",
      price: "$100 - $300",
      features: ["Wireframes", "Mockups", "Prototypes", "Design Systems"],
      duration: "2-5 days"
    },
    {
      icon: BookOpen,
      title: "Programming Assignments",
      description: "Help with coding assignments and projects",
      price: "$50 - $200",
      features: ["Python/Java/C++", "Data Structures", "Algorithms", "Code Documentation"],
      duration: "1-3 days"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Submit Brief",
      description: "Tell us about your assignment requirements and deadline"
    },
    {
      step: "02",
      title: "Free Consultation",
      description: "30-minute discussion to understand your needs better"
    },
    {
      step: "03",
      title: "Development",
      description: "We build your project with regular updates"
    },
    {
      step: "04",
      title: "Explanation",
      description: "We explain the code/design so you understand it completely"
    }
  ];

  const benefits = [
    "Affordable student pricing",
    "Quick turnaround times",
    "High-quality work",
    "Code explanation included",
    "Revision support",
    "24/7 communication"
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
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t("students.title")}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {t("students.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-[#001F3F] hover:bg-gray-100">
                <Link to="/contact">
                  {t("students.consultation")}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#001F3F]">
                <a href="#pricing">
                  {t("students.pricing")}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why Choose Vorca for Your Assignments?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We understand the challenges students face and provide tailored solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#001F3F] mb-4">
              Student Services & Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparent pricing designed for student budgets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-[#001F3F] rounded-lg flex items-center justify-center mb-4">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-[#001F3F]">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-[#001F3F]">
                        {service.price}
                      </div>
                      <Badge variant="secondary" className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {service.duration}
                      </Badge>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full">
                      <Link to="/contact">
                        Get Started
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple process from brief to completion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#001F3F] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-[#001F3F] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#001F3F] mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "Do you guarantee good grades?",
                answer: "While we can't guarantee grades (as that depends on your professor's evaluation), we ensure high-quality work that meets academic standards and provide thorough explanations so you understand the project completely."
              },
              {
                question: "How do you ensure I understand the work?",
                answer: "Every project includes a detailed explanation session where we walk through the code/design, explain the concepts used, and answer any questions you have."
              },
              {
                question: "What if I need revisions?",
                answer: "We include reasonable revisions in our pricing. If your professor requests changes or you need modifications, we'll work with you to make them."
              },
              {
                question: "Is this considered cheating?",
                answer: "We provide educational assistance and tutoring. It's your responsibility to use our work according to your institution's academic integrity policies. We recommend using our work as a learning reference."
              },
              {
                question: "How quickly can you complete my project?",
                answer: "Turnaround times vary based on complexity. Simple assignments can be completed in 1-2 days, while complex projects may take up to a week. We always respect your deadlines."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-[#001F3F] mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">
                      {faq.answer}
                    </p>
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
              Ready to Ace Your Assignment?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get your free consultation and let's discuss your project requirements.
            </p>
            <Button asChild size="lg" className="bg-white text-[#001F3F] hover:bg-gray-100">
              <Link to="/contact">
                Start Free Consultation
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
