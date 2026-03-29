"use client"
import React from 'react';
import { useEffect, useRef, useState } from "react"
import { Calendar, Clock, MapPin, Users, AlertTriangle, Timer } from "lucide-react"
import { getEvents } from '../lib/db'
import type { Event } from '../lib/types'

const Events = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    getEvents()
      .then(setAllEvents)
      .finally(() => setLoading(false))
  }, [])

  const availableEvents = allEvents.filter((event) => {
    if (!event.registration_deadline) return true
    return new Date(event.registration_deadline) >= currentDate
  })

  const getDaysUntilDeadline = (deadline: string) => {
    const diffTime = new Date(deadline).getTime() - currentDate.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const formatDeadlineDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    })
  }

  const getUrgencyStatus = (deadline?: string) => {
    if (!deadline) return { status: "plenty", color: "bg-green-100 text-green-800", message: "Open" }
    const daysLeft = getDaysUntilDeadline(deadline)
    if (daysLeft <= 1) return { status: "urgent", color: "bg-red-100 text-red-800", message: "Last day!" }
    if (daysLeft <= 3) return { status: "soon", color: "bg-orange-100 text-orange-800", message: `${daysLeft} days left` }
    if (daysLeft <= 7) return { status: "moderate", color: "bg-yellow-100 text-yellow-800", message: `${daysLeft} days left` }
    return { status: "plenty", color: "bg-green-100 text-green-800", message: `${daysLeft} days left` }
  }

  // Format event_date for display (e.g. "MAR 29 - 30")
  const formatEventDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    const day = d.getDate()
    return { month, day: String(day) }
  }

  return (
    <section id="events" ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4" />
            Community Events
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay connected with our community through regular meetups, workshops, and unforgettable adventures across Tanzania.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading events...</div>
        ) : availableEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              All current events have passed their registration deadlines. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {availableEvents.map((event, index) => {
              const urgencyStatus = getUrgencyStatus(event.registration_deadline)
              const { month, day } = formatEventDate(event.event_date)

              return (
                <div
                  key={event.id}
                  className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                    {urgencyStatus.status === "urgent" && (
                      <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-red-500">
                        <AlertTriangle className="absolute -top-12 -right-4 h-4 w-4 text-white transform rotate-45" />
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex flex-col items-center justify-center text-white">
                          <div className="text-sm font-medium">{month}</div>
                          <div className="text-lg font-bold">{day}</div>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">{event.title}</h3>
                          <div className="flex items-center gap-2">
                            {event.event_type && (
                              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                {event.event_type}
                              </span>
                            )}
                            {event.registration_deadline && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${urgencyStatus.color}`}>
                                <Timer className="h-3 w-3" />
                                {urgencyStatus.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          {event.time && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />{event.time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />{event.location}
                            </div>
                          )}
                          {event.attendees && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />{event.attendees} attending
                            </div>
                          )}
                        </div>

                        {event.registration_deadline && (
                          <div className="text-xs text-gray-500">
                            Registration deadline: {formatDeadlineDate(event.registration_deadline)}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                          urgencyStatus.status === "urgent"
                            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}>
                          {urgencyStatus.status === "urgent" ? "Register Now!" : "Join Event"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Events