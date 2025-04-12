import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import admin1 from '../assets/he-knows-what-he-wants.webp'; // Placeholder for new image
import faculty2 from '../assets/he-knows-what-he-wants.webp'; // Placeholder for new image
import student3 from '../assets/he-knows-what-he-wants.webp'; // Placeholder for new image

const TimetableReviews = () => {
  const testimonials = [
    {
      name: "Dr. Emily Carter",
      role: "University Administrator",
      school: "Westview University",
      rating: 5,
      content: "This platform transformed our scheduling process. We now generate conflict-free timetables in hours, saving weeks of manual work!",
      image: admin1
    },
    {
      name: "Prof. James Lee",
      role: "Computer Science Faculty",
      school: "Eastwood Institute",
      rating: 5,
      content: "The system respects my availability and room preferences perfectly. Teaching coordination has never been this smooth.",
      image: faculty2
    },
    {
      name: "Anita Sharma",
      role: "Undergraduate Student",
      school: "Northlake College",
      rating: 4,
      content: "I love how easy it is to access my class schedule online. It fits my preferences, and there are no clashes!",
      image: student3
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by <span className="text-indigo-600">University Communities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from administrators, faculty, and students benefiting from our intelligent timetable generator
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"} 
                  />
                ))}
              </div>
              
              <FaQuoteLeft className="text-indigo-200 text-3xl mb-4" />
              
              <p className="text-gray-700 italic mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.school}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
          >
            Read More Success Stories
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default TimetableReviews;