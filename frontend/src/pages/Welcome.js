import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Target, 
  Users, 
  CheckCircle, 
  Star,
  Calendar,
  TrendingUp,
  Shield
} from 'lucide-react';

const Welcome = () => {
  // Mock navigate function for demo
  const navigate = (path) => {
    console.log('Navigating to:', path);
  };
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Setting",
      description: "Set meaningful goals and track your progress with intelligent insights"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Habit Tracking",
      description: "Build lasting habits with our science-backed tracking system"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Analytics",
      description: "Visualize your journey with detailed progress reports"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Support",
      description: "Connect with like-minded individuals on similar journeys"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Wellness Focus",
      description: "Holistic approach to mental, physical, and emotional wellbeing"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your data is secure and private, always under your control"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "Alethea transformed my daily routine. I've never felt more organized and purposeful.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Student",
      content: "The habit tracking feature helped me build consistency in my studies and fitness.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Entrepreneur",
      content: "Finally, a platform that understands the journey of personal growth and healing.",
      rating: 5
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Goals Achieved" },
    { number: "95%", label: "Success Rate" },
    { number: "4.9★", label: "User Rating" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Testimonial carousel
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Alethea
                </span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Features</a>
                <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">Reviews</a>
                <a href="#about" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">About</a>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="w-full pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full px-6 py-3 mb-8">
                  <Sparkles className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-indigo-700 font-semibold">Your Journey Starts Here</span>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    The Way of
                  </span>
                  <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Alethea
                  </span>
                </h1>
                
                {/* Subtitle */}
                <div className="max-w-4xl mx-auto mb-12">
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed">
                    Transform your life through the power of{' '}
                    <span className="text-indigo-600 font-semibold">habits</span>,{' '}
                    <span className="text-purple-600 font-semibold">healing</span>, and{' '}
                    <span className="text-pink-600 font-semibold">hope</span>.
                  </p>
                  <p className="text-lg text-gray-500 mt-4">
                    Join thousands who've discovered their true potential.
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <button
                    onClick={() => navigate('/signup')}
                    className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl flex items-center"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/login')}
                    className="group border-2 border-indigo-300 text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    Welcome Back
                    <Heart className="ml-2 w-5 h-5 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-white/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose Alethea?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover the tools and features that make personal transformation not just possible, but inevitable.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                What Our Users Say
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Real stories from people who transformed their lives with Alethea.
              </p>
            </div>

            {/* Testimonial Card */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
                <div className="text-center">
                  
                  {/* Stars */}
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <blockquote className="text-xl sm:text-2xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  {/* Author */}
                  <div>
                    <div className="text-lg font-bold text-gray-800 mb-1">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonial Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-indigo-600 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            
            <p className="text-lg sm:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of others who've discovered the power of intentional living. 
              Your journey to a better you starts with a single step.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/signup')}
                className="group bg-white text-indigo-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-gray-50 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
              >
                Start Free Today
                <CheckCircle className="ml-2 w-5 h-5 group-hover:text-green-500 transition-colors" />
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              
              {/* Logo */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Alethea</span>
              </div>
              
              {/* Footer Text */}
              <p className="text-gray-400 mb-6 text-center">
                Empowering your journey toward habits, healing, and hope.
              </p>
              
              {/* Footer Links */}
              <div className="flex justify-center space-x-8 text-gray-400">
                <button className="hover:text-white transition-colors">Privacy</button>
                <button className="hover:text-white transition-colors">Terms</button>
                <button className="hover:text-white transition-colors">Support</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;