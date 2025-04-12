import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaChalkboardTeacher, 
  FaUserGraduate, 
  FaAward,
  FaSchool,
  FaLightbulb,
  FaHandsHelping
} from 'react-icons/fa';
import teamPlaceholder from '../assets/vecteezy_young-learners-enjoying-hands-on-programming-lessons_55545013.png'; // Placeholder for new image
import aboutHero from '../assets/vecteezy_magnificent-abstract-modern-classroom-with-students-and_57453370.png'; // Placeholder for new image

const TimetableAbout = () => {
  const stats = [
    { value: '50K+', label: 'Schedules Generated', icon: <FaUserGraduate className="text-indigo-600 text-3xl" /> },
    { value: '1K+', label: 'Faculty Supported', icon: <FaChalkboardTeacher className="text-indigo-600 text-3xl" /> },
    { value: '200+', label: 'Rooms Managed', icon: <FaSchool className="text-indigo-600 text-3xl" /> },
    { value: '24/7', label: 'Dedicated Support', icon: <FaHandsHelping className="text-indigo-600 text-3xl" /> },
  ];

  const features = [
    {
      title: "Intelligent Scheduling",
      description: "Our Genetic Algorithm-powered platform creates conflict-free timetables effortlessly.",
      icon: <FaLightbulb className="text-indigo-500 text-2xl" />
    },
    {
      title: "Proven Efficiency",
      description: "Universities report up to 40% reduction in scheduling time with our system.",
      icon: <FaAward className="text-indigo-500 text-2xl" />
    },
    {
      title: "User-Centric Design",
      description: "Built for admins, faculty, and students, with intuitive tools for seamless schedule access.",
      icon: <FaChalkboardTeacher className="text-indigo-500 text-2xl" />
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-700 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutHero} 
            alt="University scheduling scene" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Revolutionizing University Scheduling
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              We're transforming timetable creation with intelligent tools that optimize resources and eliminate conflicts for universities.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Learn More About Our Mission
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src={teamPlaceholder} 
                  alt="Our scheduling team" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-20 blur-xl"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-indigo-600">Journey</span> in Scheduling Technology
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2024 by a team of technologists and academic administrators, we identified the need for efficient university scheduling solutions. Our platform emerged from deep collaboration with universities to address complex scheduling challenges.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Today, we empower universities worldwide with our intelligent timetable generator, streamlining operations and enhancing academic coordination.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
              >
                Meet Our Team
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Universities <span className="text-indigo-600">Choose Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We blend advanced Genetic Algorithms with user-friendly design to deliver scheduling solutions that work for universities of all sizes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Optimize Your University Schedule?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Join universities worldwide streamlining their scheduling with our intelligent platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TimetableAbout;