"use client"

import React from "react"
import { useEffect, useRef, useState } from "react"
import { Star, Users, Shield, Check } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import SimpleMembershipForm from "../components/SimpleMembershipForm"

const Membership = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const plans = [
    {
      name: "Basic",
      price: "50,000",
      period: "TSh/month",
      description: "Perfect for casual Land Rover enthusiasts",
      features: [
        "Monthly club meetings",
        "Basic maintenance tips",
        "Community forum access",
        "Newsletter subscription"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "100,000",
      period: "TSh/month",
      description: "Ideal for active off-road adventurers",
      features: [
        "All Basic features",
        "Monthly off-road trips",
        "Technical workshops",
        "Priority event booking",
        "Exclusive member discounts"
      ],
      popular: true
    },
    {
      name: "VIP",
      price: "200,000",
      period: "TSh/month",
      description: "Ultimate experience for Land Rover enthusiasts",
      features: [
        "All Premium features",
        "Private expedition access",
        "Personal mechanic consultation",
        "VIP event invitations",
        "Annual Land Rover merchandise"
      ],
      popular: false
    }
  ]

  return (
    <section id="membership" ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="h-4 w-4" />
            Membership Plans
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Join Our{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect membership plan that suits your Land Rover adventure needs
          </p>
        </div>

        {!showForm ? (
          <>
            {/* Membership Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`transition-all duration-1000 transform ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card className={`relative h-full ${plan.popular ? "ring-2 ring-green-500 scale-105" : ""}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center pb-8">
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-green-600">{plan.price}</span>
                        <span className="text-gray-500 ml-2">{plan.period}</span>
                      </div>
                      <p className="text-gray-600 mt-4">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${
                          plan.popular
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-900 hover:bg-gray-800"
                        }`}
                        onClick={() => setShowForm(true)}
                      >
                        Choose {plan.name}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div
              className={`text-center transition-all duration-1000 delay-600 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Not sure which membership is right for you?</h3>
                  <p className="text-gray-600 mb-6">
                    Contact our team for personal advice based on your preferences and experience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
                      Apply Membership
                    </Button>
                    <Button variant="outline">Get Advice</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <SimpleMembershipForm onBack={() => setShowForm(false)} />
        )}
      </div>
    </section>
  )
}

export default Membership
