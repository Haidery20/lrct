import React, { useEffect, useRef, useState } from 'react';
import { Check, Star, Users, Shield } from 'lucide-react';
import AuthModal from './AuthModal';

const Membership = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const plans = [
    {
      name: 'Explorer',
      price: 'TSh 50,000',
      period: '/year',
      description: 'Perfect for newcomers to the off-road community',
      features: [
        'Monthly club meetings',
        'Basic trail access',
        'Newsletter subscription',
        'Community forum access',
        'Emergency contact list'
      ],
      icon: Users,
      popular: false
    },
    {
      name: 'Adventurer',
      price: 'TSh 120,000',
      period: '/year',
      description: 'For serious off-road enthusiasts',
      features: [
        'All Explorer benefits',
        'Priority event booking',
        'Advanced trail access',
        'Technical workshops',
        'Equipment discounts',
        'Trip planning assistance'
      ],
      icon: Star,
      popular: true
    },
    {
      name: 'Expedition',
      price: 'TSh 200,000',
      period: '/year',
      description: 'Ultimate membership for expedition leaders',
      features: [
        'All Adventurer benefits',
        'Exclusive expedition access',
        'Leadership training',
        'Vehicle recovery service',
        'Insurance coverage',
        'Guest privileges',
        'Annual gear package'
      ],
      icon: Shield,
      popular: false
    }
  ];

  return (
    <section id="membership" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the membership level that fits your adventure style. 
            All memberships include access to our supportive community and expert guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`transition-all duration-1000 delay-${index * 200} transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <div className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-green-500 scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl p-4 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      <plan.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-gray-600 text-center mb-6">
                    {plan.description}
                  </p>

                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Choose {plan.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-1000 delay-600 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Not sure which membership is right for you?
            </h3>
            <p className="text-gray-600 mb-6">
              Contact our team for a personalized recommendation based on your interests and experience level.
            </p>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Get Advice
            </button>
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signup"
      />
    </section>
  );
};

export default Membership;