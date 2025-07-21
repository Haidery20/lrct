"use client"

import { useEffect, useRef, useState } from "react"
import {
  Compass,
  Camera,
  Users,
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

const Adventures = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Update current date every minute to handle real-time deadline checking
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  const adventures = [
    {
      title: "Landrover festival",
      description: "Meet the Landrover Enthusiasts with models and series enjoy and connect.",
      difficulty: "festival",
      duration: "3 Days",
      participants: "100+",
      startDate: "2024-10-11",
      registrationDeadline: "2024-10-05",
      image: "/images/landroverfestival.jpg",
      color: "from-orange-500 to-red-500",
      featured: true,
    },
    {
      title: "Mpalano festival",
      description:
        "Enjoy the beauty of Matema Beach with a diverse range of activities.",
      difficulty: "Intermediate",
      duration: "5 Days",
      participants: "100+",
      startDate: "2025-07-04",
      registrationDeadline: "2025-02-25",
      image: "/images/mpalano.jpg",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "East Africa road trip",
      description: "discover the best landscape sceneries in East Africa.",
      difficulty: "intermediate",
      duration: "14 Days",
      participants: "20+",
      startDate: "2025-11-15",
      registrationDeadline: "2025-10-20",
      image: "/images/asset_6.avif",
      color: "from-blue-500 to-cyan-500",
    },
    
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-orange-100 text-orange-800"
      case "Expert":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isRegistrationClosed = (deadline: string) => {
    return new Date(deadline) < currentDate
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - currentDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getRegistrationStatus = (deadline: string) => {
    const daysLeft = getDaysUntilDeadline(deadline)

    if (daysLeft < 0) {
      return { status: "closed", message: "Registration Closed", color: "text-red-600 bg-red-50" }
    } else if (daysLeft <= 3) {
      return { status: "urgent", message: `${daysLeft} days left`, color: "text-orange-600 bg-orange-50" }
    } else if (daysLeft <= 7) {
      return { status: "soon", message: `${daysLeft} days left`, color: "text-yellow-600 bg-yellow-50" }
    } else {
      return { status: "open", message: `${daysLeft} days left`, color: "text-green-600 bg-green-50" }
    }
  }

  return (
    <section id="adventures" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Compass className="h-4 w-4" />
            Adventure Experiences
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Epic Adventures{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Await</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From challenging mountain trails to serene coastal routes, discover Tanzania's most spectacular landscapes
            with fellow Land Rover enthusiasts and expert guides.
          </p>
        </div>

        {/* Adventures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adventures.map((adventure, index) => {
            const registrationStatus = getRegistrationStatus(adventure.registrationDeadline)
            const isClosed = isRegistrationClosed(adventure.registrationDeadline)

            return (
              <div
                key={adventure.title}
                className={`transition-all duration-1000 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 ${
                    adventure.featured ? "ring-2 ring-green-500 ring-opacity-50" : ""
                  } ${isClosed ? "opacity-75" : ""}`}
                >
                  {adventure.featured && (
                    <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}

                  {/* Registration Status Badge */}
                  <div
                    className={`absolute top-4 ${adventure.featured ? "right-20" : "right-4"} z-10 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${registrationStatus.color}`}
                  >
                    {isClosed ? <AlertCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                    {registrationStatus.message}
                  </div>

                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={adventure.image || "/placeholder.svg"}
                      alt={adventure.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        isClosed ? "grayscale group-hover:grayscale-0" : "group-hover:scale-110"
                      }`}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        isClosed ? "from-black/70 via-black/30" : "from-black/60 via-black/20"
                      } to-transparent`}
                    ></div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center text-white text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(adventure.difficulty)} bg-opacity-90`}
                        >
                          <TrendingUp className="inline h-3 w-3 mr-1" />
                          {adventure.difficulty}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {adventure.duration}
                          </span>
                          <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {adventure.participants}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3
                      className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                        isClosed ? "text-gray-600" : "text-gray-900 group-hover:text-green-600"
                      }`}
                    >
                      {adventure.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{adventure.description}</p>

                    {/* Event Dates */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Event Date:</span>
                        <span className="font-medium text-gray-700">{formatDate(adventure.startDate)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Registration Deadline:</span>
                        <span className={`font-medium ${isClosed ? "text-red-600" : "text-gray-700"}`}>
                          {formatDate(adventure.registrationDeadline)}
                        </span>
                      </div>
                    </div>

                    {/* Registration Button */}
                    {isClosed ? (
                      <div className="w-full">
                        <button
                          disabled
                          className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Registration Closed
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">Registration deadline has passed</p>
                      </div>
                    ) : (
                      <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group">
                        Register Now
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-700 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready for Your Next Adventure?</h3>
            <p className="text-gray-600 mb-6">
              Join our community of explorers and discover the untamed beauty of Tanzania with expert guides and premium
              Land Rover vehicles. Register early to secure your spot!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105">
                View All Adventures
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Adventures
