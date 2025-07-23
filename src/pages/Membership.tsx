"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { Check, Star, Users, Shield, Download, Upload, FileText } from "lucide-react"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Checkbox } from "../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"

const Membership = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    // Applicant Information (Taarifa za Mwombaji)
    jinaLaMwombaji: "",
    tareheyaKuzaliwa: "",
    jinsia: "",
    anuaniKamili: "",
    slp: "",
    nambaYaSimu: "",
    baruaPepe: "",
    wasifuWaMwombaji: "",
    umepatajeTaarifa: "",
    tamkoLaMwombaji: "",

    // Guarantor Information (Mdhamini)
    jinaLaMdhamini: "",
    anuaniYaMdhamini: "",
    slpYaMdhamini: "",
    nambaYaSimuYaMdhamini: "",
    baruaPepeYaMdhamini: "",
    malezoYaMdhamini: "",

    // Photo upload
    picha: null as File | null,

    // Agreement
    termsAccepted: false,
  })

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

    return () => observer.disconnect()
  }, [])

  const plans = [
    {
      name: "Explorer",
      price: "TSh 50,000",
      period: "/year",
      description: "Perfect for newcomers to the off-road community",
      features: [
        "Monthly club meetings",
        "Basic trail access",
        "Newsletter subscription",
        "Community forum access",
        "Emergency contact list",
      ],
      icon: Users,
      popular: false,
    },
    {
      name: "Adventurer",
      price: "TSh 120,000",
      period: "/year",
      description: "For serious off-road enthusiasts",
      features: [
        "All Explorer benefits",
        "Priority event booking",
        "Advanced trail access",
        "Technical workshops",
        "Equipment discounts",
        "Trip planning assistance",
      ],
      icon: Star,
      popular: true,
    },
    {
      name: "Expedition",
      price: "TSh 200,000",
      period: "/year",
      description: "Ultimate membership for expedition leaders",
      features: [
        "All Adventurer benefits",
        "Exclusive expedition access",
        "Leadership training",
        "Vehicle recovery service",
        "Insurance coverage",
        "Guest privileges",
        "Annual gear package",
      ],
      icon: Shield,
      popular: false,
    },
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      picha: file,
    }))
  }

  const queryClient = useQueryClient()

  // Get next reference number for display
  const { data: nextRefData } = useQuery<{ referenceNumber: string }>({
    queryKey: ['/api/next-reference-number'],
    enabled: showForm,
  })

  // Submit membership application
  const submitMutation = useMutation({
    mutationFn: async (applicationData: any) => {
      const response = await fetch('/api/membership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })
      if (!response.ok) {
        throw new Error('Failed to submit application')
      }
      return response.json()
    },
    onSuccess: (data) => {
      alert(`Maombi ya ujumbe yamewasilishwa kwa mafanikio! Namba ya kumbukumbu: ${data.referenceNumber}`)
      setFormData({
        jinaLaMwombaji: "",
        tareheyaKuzaliwa: "",
        jinsia: "",
        anuaniKamili: "",
        slp: "",
        nambaYaSimu: "",
        baruaPepe: "",
        wasifuWaMwombaji: "",
        umepatajeTaarifa: "",
        tamkoLaMwombaji: "",
        jinaLaMdhamini: "",
        anuaniYaMdhamini: "",
        slpYaMdhamini: "",
        nambaYaSimuYaMdhamini: "",
        baruaPepeYaMdhamini: "",
        malezoYaMdhamini: "",
        picha: null,
        termsAccepted: false,
      })
      setShowForm(false)
      queryClient.invalidateQueries({ queryKey: ['/api/next-reference-number'] })
    },
    onError: (error) => {
      console.error('Error submitting application:', error)
      alert('Kuna hitilafu imetokea. Jaribu tena.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Remove fields that are not needed for the database
    const { picha, termsAccepted, tamkoLaMwombaji, ...dbData } = formData
    submitMutation.mutate(dbData)
  }

  // Generate ODF (Open Document Format) content
  const generateODFContent = () => {
    const currentDate = new Date().toLocaleDateString("sw-TZ")
    
    // ODF content with proper XML structure for OpenDocument Text format
    const odfContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2">
  <office:automatic-styles>
    <style:style style:name="P1" style:family="paragraph">
      <style:paragraph-properties fo:text-align="center"/>
      <style:text-properties fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="P2" style:family="paragraph">
      <style:paragraph-properties fo:text-align="left"/>
    </style:style>
  </office:automatic-styles>
  <office:body>
    <office:text>
      <text:p text:style-name="P2">
        <draw:frame draw:style-name="fr1" draw:name="ClubLogo" text:anchor-type="paragraph" svg:width="2cm" svg:height="2cm" draw:z-index="0">
          <draw:image xlink:href="/images/club_logo.svg" xlink:type="simple" xlink:show="embed" xlink:actuate="onLoad"/>
        </draw:frame>
        ${formData.picha ? `
        <draw:frame draw:style-name="fr2" draw:name="UserPhoto" text:anchor-type="paragraph" svg:width="3.5cm" svg:height="4.7cm" draw:z-index="1" svg:x="14cm" svg:y="3cm">
          <draw:text-box>
            <text:p>Picha ya Mwombaji (Uploaded Image)</text:p>
          </draw:text-box>
        </draw:frame>` : ''}
      </text:p>
      <text:p text:style-name="P1">LAND ROVER CLUB TANZANIA</text:p>
      <text:p>P. O. BOX 77, MOROGORO. TANZANIA</text:p>
      <text:p>TEL; +255 763 652 641/+255 718 133 333</text:p>
      <text:p>Email; landroverclubtz@gmail.com</text:p>
      <text:p></text:p>
      <text:p>Kumb Na. ${nextRefData?.referenceNumber || 'LRCT/Adm/..........'}     Tarehe ${currentDate}</text:p>
      <text:p></text:p>
      <text:p text:style-name="P1">A. MAELEZO YA MWOMBAJI NA MDHAMINI</text:p>
      <text:p>1. TAARIFA BINAFSI</text:p>
      <text:p>1.1 Jina la Mwombaji: ${formData.jinaLaMwombaji}</text:p>
      <text:p>1.2 Tarehe ya Kuzaliwa: ${formData.tareheyaKuzaliwa}</text:p>
      <text:p>1.3 Jinsia: ${formData.jinsia === "me" ? "Me ✓" : "Me"} ${formData.jinsia === "ke" ? "Ke ✓" : "Ke"}</text:p>
      <text:p>1.4 Anuani Kamili: S.L.P ${formData.slp}</text:p>
      <text:p>${formData.anuaniKamili}</text:p>
      <text:p>Namba ya simu: ${formData.nambaYaSimu} Barua pepe: ${formData.baruaPepe}</text:p>
      <text:p></text:p>
      <text:p>1.5 Wasifu wa mwombaji kwa ufipi:</text:p>
      <text:p>${formData.wasifuWaMwombaji}</text:p>
      <text:p></text:p>
      <text:p>1.6 Umepataje taarifa za Tanzania Land Rover Club: ${formData.umepatajeTaarifa}</text:p>
      <text:p></text:p>
      <text:p>2. MDHAMINI</text:p>
      <text:p>2.1 Jina la Mdhamini: ${formData.jinaLaMdhamini}</text:p>
      <text:p>2.2 Anuani kamili; S.L.P: ${formData.slpYaMdhamini}</text:p>
      <text:p>${formData.anuaniYaMdhamini}</text:p>
      <text:p>Namba ya simu: ${formData.nambaYaSimuYaMdhamini} Barua pepe: ${formData.baruaPepeYaMdhamini}</text:p>
      <text:p>2.3 Maelezo ya mdhamini: ${formData.malezoYaMdhamini}</text:p>
      <text:p>2.4 Sahihi ya Mdhamini .................. Tarehe ${currentDate}</text:p>
      <text:p></text:p>
      <text:p>Muhimu; Maombi haya yatumwe kwa njia ya barua pepe ya Klabu, landroverclubtz@gmail.com</text:p>
    </office:text>
  </office:body>
</office:document-content>`
    
    return odfContent
  }

  // Generate PDF using jsPDF
  const generatePDF = async () => {
    const currentDate = new Date().toLocaleDateString("sw-TZ")
    const doc = new jsPDF()
    
    // Set font
    doc.setFont("helvetica", "normal")
    
    // Add club logo in the left top corner
    try {
      // Create a canvas to convert SVG to PNG for PDF compatibility
      const logoImg = new Image()
      logoImg.crossOrigin = 'anonymous'
      logoImg.src = '/images/club_logo.svg'
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          try {
            // Create a canvas to convert SVG to raster format
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            canvas.width = 120 // Higher resolution for better quality
            canvas.height = 120
            
            // Draw image on canvas with white background
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height)
            
            // Get base64 data URL
            const dataURL = canvas.toDataURL('image/png')
            
            // Add logo to PDF (left top corner)
            doc.addImage(dataURL, 'PNG', 10, 10, 30, 30)
            resolve(true)
          } catch (err) {
            console.log('Error processing logo:', err)
            resolve(false)
          }
        }
        logoImg.onerror = () => {
          console.log('Could not load logo image')
          resolve(false)
        }
      })
    } catch (error) {
      console.log('Could not load logo:', error)
    }
    
    // Header (adjusted for logo)
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("LAND ROVER CLUB TANZANIA", 105, 20, { align: "center" })
    
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("P. O. BOX 77, MOROGORO. TANZANIA", 105, 30, { align: "center" })
    doc.text("TEL; +255 763 652 641/+255 718 133 333", 105, 36, { align: "center" })
    doc.text("Email; landroverclubtz@gmail.com", 105, 42, { align: "center" })
    
    // Reference and Date
    doc.text(`Kumb Na. ${nextRefData?.referenceNumber || 'LRCT/Adm/..........'}     Tarehe ${currentDate}`, 20, 60)
    
    // Section A
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("A. MAELEZO YA MWOMBAJI NA MDHAMINI", 20, 80)
    doc.text("1. TAARIFA BINAFSI", 20, 95)
    
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    let yPos = 110
    
    // Add user's uploaded photo if available (right side of page)
    if (formData.picha) {
      try {
        const photoImg = new Image()
        photoImg.src = URL.createObjectURL(formData.picha)
        
        await new Promise((resolve, reject) => {
          photoImg.onload = () => {
            try {
              // Create canvas to process the uploaded photo
              const canvas = document.createElement('canvas')
              const ctx = canvas.getContext('2d')
              canvas.width = 150
              canvas.height = 200
              
              // Draw white background
              ctx.fillStyle = 'white'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              
              // Calculate dimensions to maintain aspect ratio
              const imgAspect = photoImg.width / photoImg.height
              const canvasAspect = canvas.width / canvas.height
              
              let drawWidth, drawHeight, offsetX, offsetY
              
              if (imgAspect > canvasAspect) {
                // Image is wider than canvas
                drawWidth = canvas.width
                drawHeight = canvas.width / imgAspect
                offsetX = 0
                offsetY = (canvas.height - drawHeight) / 2
              } else {
                // Image is taller than canvas
                drawWidth = canvas.height * imgAspect
                drawHeight = canvas.height
                offsetX = (canvas.width - drawWidth) / 2
                offsetY = 0
              }
              
              // Draw image centered
              ctx.drawImage(photoImg, offsetX, offsetY, drawWidth, drawHeight)
              
              // Convert to base64
              const photoDataURL = canvas.toDataURL('image/png')
              
              // Add photo to PDF (right side, adjusted size for passport photo)
              doc.addImage(photoDataURL, 'PNG', 160, 110, 35, 47)
              
              // Add photo label
              doc.setFontSize(8)
              doc.text("Picha ya Mwombaji", 162, 162)
              doc.setFontSize(11)
              
              resolve(true)
            } catch (err) {
              console.log('Error processing uploaded photo:', err)
              resolve(false)
            }
          }
          photoImg.onerror = () => {
            console.log('Could not load uploaded photo')
            resolve(false)
          }
        })
      } catch (error) {
        console.log('Error loading uploaded photo:', error)
      }
    }

    // Form data
    doc.text(`1.1 Jina la Mwombaji: ${formData.jinaLaMwombaji}`, 20, yPos)
    yPos += 10
    doc.text(`1.2 Tarehe ya Kuzaliwa: ${formData.tareheyaKuzaliwa}`, 20, yPos)
    yPos += 10
    doc.text(`1.3 Jinsia: ${formData.jinsia === "me" ? "Me ✓" : "Me"} ${formData.jinsia === "ke" ? "Ke ✓" : "Ke"}`, 20, yPos)
    yPos += 10
    doc.text(`1.4 Anuani Kamili: S.L.P ${formData.slp}`, 20, yPos)
    yPos += 6
    doc.text(`${formData.anuaniKamili}`, 20, yPos)
    yPos += 10
    doc.text(`Namba ya simu: ${formData.nambaYaSimu} Barua pepe: ${formData.baruaPepe}`, 20, yPos)
    
    // Add new page for continuation
    doc.addPage()
    yPos = 20
    
    doc.text(`1.5 Wasifu wa mwombaji: ${formData.wasifuWaMwombaji}`, 20, yPos)
    yPos += 20
    doc.text(`1.6 Umepataje taarifa: ${formData.umepatajeTaarifa}`, 20, yPos)
    
    // Guarantor section
    yPos += 30
    doc.setFont("helvetica", "bold")
    doc.text("2. MDHAMINI", 20, yPos)
    yPos += 15
    
    doc.setFont("helvetica", "normal")
    doc.text(`2.1 Jina la Mdhamini: ${formData.jinaLaMdhamini}`, 20, yPos)
    yPos += 10
    doc.text(`2.2 Anuani: ${formData.anuaniYaMdhamini}`, 20, yPos)
    yPos += 10
    doc.text(`Simu: ${formData.nambaYaSimuYaMdhamini} Barua pepe: ${formData.baruaPepeYaMdhamini}`, 20, yPos)
    
    // Save as PDF
    doc.save(`LRCT-Application-${formData.jinaLaMwombaji || "Form"}.pdf`)
  }

  // Generate ODF file
  const generateODF = () => {
    const odfContent = generateODFContent()
    const blob = new Blob([odfContent], { 
      type: "application/vnd.oasis.opendocument.text" 
    })
    saveAs(blob, `LRCT-Application-${formData.jinaLaMwombaji || "Form"}.odt`)
  }



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
            Choose the membership level that fits your adventure style. All memberships include access to our supportive
            community and expert guidance.
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
                  <div
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                      plan.popular ? "ring-2 ring-green-500 scale-105" : ""
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="p-8">
                      <div className="flex items-center justify-center mb-6">
                        <div
                          className={`w-16 h-16 rounded-2xl p-4 ${
                            plan.popular
                              ? "bg-gradient-to-r from-green-500 to-emerald-500"
                              : "bg-gradient-to-r from-gray-500 to-gray-600"
                          }`}
                        >
                          <plan.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>

                      <p className="text-gray-600 text-center mb-6">{plan.description}</p>

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

                      <Button
                        onClick={() => setShowForm(true)}
                        className={`w-full py-4 font-semibold transition-all duration-300 transform hover:scale-105 ${
                          plan.popular ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        Choose {plan.name}
                      </Button>
                    </div>
                  </div>
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
          /* Official LRCT Membership Application Form */
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center bg-green-50">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">LAND ROVER CLUB TANZANIA</h1>
                <p className="text-sm text-gray-600">P. O. BOX 77, MOROGORO. TANZANIA</p>
                <p className="text-sm text-gray-600">TEL; +255 763 652 641/+255 718 133 333</p>
                <p className="text-sm text-gray-600">Email; landroverclubtz@gmail.com</p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Kumb Na. {nextRefData?.referenceNumber || 'LRCT/Adm/...........'}</span>
                <span>Tarehe {new Date().toLocaleDateString("sw-TZ")}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* A. MAELEZO YA MWOMBAJI NA MDHAMINI */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">
                    A. MAELEZO YA MWOMBAJI NA MDHAMINI
                  </h2>

                  {/* 1. TAARIFA BINAFSI */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">1. TAARIFA BINAFSI</h3>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="jinaLaMwombaji">1.1 Jina la Mwombaji *</Label>
                        <Input
                          id="jinaLaMwombaji"
                          value={formData.jinaLaMwombaji}
                          onChange={(e: { target: { value: any } }) => handleInputChange("jinaLaMwombaji", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="tareheyaKuzaliwa">
                          1.2 Tarehe ya Kuzaliwa * (Ambatisha nakala ya Kitambulisho cha Taifa au Hati ya Kusafiria)
                        </Label>
                        <Input
                          id="tareheyaKuzaliwa"
                          type="date"
                          value={formData.tareheyaKuzaliwa}
                          onChange={(e: { target: { value: any } }) => handleInputChange("tareheyaKuzaliwa", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>1.3 Jinsia *</Label>
                        <RadioGroup
                          value={formData.jinsia}
                          onValueChange={(value: any) => handleInputChange("jinsia", value)}
                          className="flex gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="me" id="me" />
                            <Label htmlFor="me">Me</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ke" id="ke" />
                            <Label htmlFor="ke">Ke</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="slp">S.L.P *</Label>
                          <Input
                            id="slp"
                            value={formData.slp}
                            onChange={(e: { target: { value: any } }) => handleInputChange("slp", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anuaniKamili">1.4 Anuani Kamili *</Label>
                          <Input
                            id="anuaniKamili"
                            value={formData.anuaniKamili}
                            onChange={(e: { target: { value: any } }) => handleInputChange("anuaniKamili", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nambaYaSimu">Namba ya simu ya mkononi *</Label>
                          <Input
                            id="nambaYaSimu"
                            value={formData.nambaYaSimu}
                            onChange={(e: { target: { value: any } }) => handleInputChange("nambaYaSimu", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="baruaPepe">Barua pepe *</Label>
                          <Input
                            id="baruaPepe"
                            type="email"
                            value={formData.baruaPepe}
                            onChange={(e: { target: { value: any } }) => handleInputChange("baruaPepe", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="wasifuWaMwombaji">1.5 Wasifu wa mwombaji kwa ufipi *</Label>
                        <Textarea
                          id="wasifuWaMwombaji"
                          value={formData.wasifuWaMwombaji}
                          onChange={(e: { target: { value: any } }) => handleInputChange("wasifuWaMwombaji", e.target.value)}
                          required
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="umepatajeTaarifa">
                          1.6 Umepataje taarifa za Tanzania Land Rover Club; Rafiki, Mwanaklabu, Mtandaoni, Namna
                          Nyingine – taja *
                        </Label>
                        <Input
                          id="umepatajeTaarifa"
                          value={formData.umepatajeTaarifa}
                          onChange={(e: { target: { value: any } }) => handleInputChange("umepatajeTaarifa", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <Label htmlFor="picha">Picha ya Mwombaji (BANDIKA PICHA) *</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Input
                            id="picha"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="flex-1"
                          />
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            {formData.picha ? (
                              <img
                                src={URL.createObjectURL(formData.picha) || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Upload className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">1.7 Tamko la Mwombaji kwa Club:</h4>
                        <p className="text-sm text-gray-700 mb-4">
                          Mimi <strong>{formData.jinaLaMwombaji || "........................"}</strong> ninaleta maombi
                          ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote
                          yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri
                          kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.
                        </p>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="tamkoAccepted"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked: any) => handleInputChange("termsAccepted", checked)}
                            required
                          />
                          <Label htmlFor="tamkoAccepted" className="text-sm">
                            Ninakubali tamko hili na masharti yote ya kujiunga na klabu *
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. MDHAMINI */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">2. MDHAMINI</h3>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="jinaLaMdhamini">2.1 Jina la Mdhamini *</Label>
                        <Input
                          id="jinaLaMdhamini"
                          value={formData.jinaLaMdhamini}
                          onChange={(e: { target: { value: any } }) => handleInputChange("jinaLaMdhamini", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="slpYaMdhamini">S.L.P *</Label>
                          <Input
                            id="slpYaMdhamini"
                            value={formData.slpYaMdhamini}
                            onChange={(e: { target: { value: any } }) => handleInputChange("slpYaMdhamini", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anuaniYaMdhamini">2.2 Anuani kamili *</Label>
                          <Input
                            id="anuaniYaMdhamini"
                            value={formData.anuaniYaMdhamini}
                            onChange={(e: { target: { value: any } }) => handleInputChange("anuaniYaMdhamini", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nambaYaSimuYaMdhamini">Namba ya simu ya Mkononi *</Label>
                          <Input
                            id="nambaYaSimuYaMdhamini"
                            value={formData.nambaYaSimuYaMdhamini}
                            onChange={(e: { target: { value: any } }) => handleInputChange("nambaYaSimuYaMdhamini", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="baruaPepeYaMdhamini">Barua pepe</Label>
                          <Input
                            id="baruaPepeYaMdhamini"
                            type="email"
                            value={formData.baruaPepeYaMdhamini}
                            onChange={(e: { target: { value: any } }) => handleInputChange("baruaPepeYaMdhamini", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="malezoYaMdhamini">2.3 Maelezo ya mdhamini kwa mdhaminiwa *</Label>
                        <Textarea
                          id="malezoYaMdhamini"
                          value={formData.malezoYaMdhamini}
                          onChange={(e: { target: { value: any } }) => handleInputChange("malezoYaMdhamini", e.target.value)}
                          required
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Structure Display */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">B. MASHARTI YA KUJIUNGA</h3>
                  <h4 className="font-semibold mb-4">3. ADA NA MICHANGO</h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Na.</th>
                          <th className="border border-gray-300 p-2 text-left">Aina ya Malipo</th>
                          <th className="border border-gray-300 p-2 text-left">Kiwango Tsh</th>
                          <th className="border border-gray-300 p-2 text-left">Maelezo</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2">1</td>
                          <td className="border border-gray-300 p-2">Malipo ya Fomu</td>
                          <td className="border border-gray-300 p-2">50,000/-</td>
                          <td className="border border-gray-300 p-2">Inalipwa mara moja wakati wa kuchukua fomu</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2">2</td>
                          <td className="border border-gray-300 p-2">Ada ya Kiingilio kwa Mwombaji</td>
                          <td className="border border-gray-300 p-2">60,000/-</td>
                          <td className="border border-gray-300 p-2">
                            Inalipwa mara moja tu (Wakati wa kujiunga na Klabu)
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2">3</td>
                          <td className="border border-gray-300 p-2">Ada ya mwezi</td>
                          <td className="border border-gray-300 p-2">15,000/-</td>
                          <td className="border border-gray-300 p-2">
                            Inalipwa kila mwezi (Kati ya Tarehe 1 hadi 5 ya Mwezi)
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2">4</td>
                          <td className="border border-gray-300 p-2">
                            Michango mbali mbali (Kama Msiba, maradhi, Sare, n.k)
                          </td>
                          <td className="border border-gray-300 p-2">50,000/-</td>
                          <td className="border border-gray-300 p-2">
                            Inaweza kulipwa pamoja na ada ya Kiingilio kwa mwanaklabu anaejiunga ama kati ya mwezi
                            Januari na Juni kwa mwanaklabu aliyekwisha jiunga
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-sm text-gray-700">
                    <p className="font-semibold">Muhimu:</p>
                    <p>
                      Mwanaklabu atatakiwa kulipa michango hii ndani ya siku 14 (kumi na nne) tangia tarehe ya
                      kukubaliwa kuwa mjumbe wa Klabu. Utaratibu wa malipo ya ada na michango utaelekezwa katika barua
                      ya kukubaliwa.
                    </p>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Rudi Kwenye Mipango
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePDF}
                    className="flex-1 flex items-center justify-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Pakua PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateODF}
                    className="flex-1 flex items-center justify-center gap-2 bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    Pakua ODF
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Inawasilisha..." : "Wasilisha Maombi"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

export default Membership
