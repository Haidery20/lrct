"use client"

import React from "react"
import QRCode from "qrcode"
import { useEffect, useRef, useState } from "react"
import { Star, Users, Shield, Check, Download, Upload, FileText } from "lucide-react"
import jsPDF from "jspdf"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Applicant Information (Taarifa za Mwombaji)
    jinaLaMwombaji: "",
    tareheyaKuzaliwa: "",
    jinsia: "",
    anuaniKamili: "",
    slp: "",
    nambaYaSimu: "",
    baruaPepe: "",
    landRoverType: "",
    landRoverModel: "",
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

    // NIDA/Passport attachment
    kitambulisho: null as File | null,

    // Agreement
    termsAccepted: false,
  })

  // Add language state
  const [language, setLanguage] = useState<"sw" | "en">("sw")

  // Add translations object
  const translations = {
    sw: {
      // Header
      clubName: "LAND ROVER CLUB TANZANIA",
      formTitle: "FOMU YA KUJIUNGA NA UANACHAMA",
      membershipPlans: "Mipango ya Uanachama",
      joinCommunity: "Jiunga na Jumuiya Yetu",
      planDescription:
        "Chagua kiwango cha uanachama kinachofaa mtindo wako wa uchunguzi. Uanachama wote unajumuisha ufikiaji wa jumuiya yetu ya kusaidia na mwongozo wa kitaalamu.",

      // Plans
      explorer: "Mchunguzi",
      adventurer: "Msafiri",
      expedition: "Msafiri Mkuu",
      explorerDesc: "Kamili kwa wapya katika jumuiya ya nje ya barabara",
      adventurerDesc: "Kwa wapenzi wa kweli wa nje ya barabara",
      expeditionDesc: "Uanachama wa juu kwa viongozi wa msafara",

      // Form sections
      applicantInfo: "MAELEZO YA MWOMBAJI NA MDHAMINI",
      personalInfo: "TAARIFA BINAFSI",
      guarantorInfo: "MDHAMINI",
      membershipTerms: "MASHARTI YA KUJIUNGA",
      feesContributions: "ADA NA MICHANGO",

      // Form fields
      applicantName: "Jina la Mwombaji",
      dateOfBirth: "Tarehe ya Kuzaliwa",
      gender: "Jinsia",
      male: "Me",
      female: "Ke",
      fullAddress: "Anuani Kamili",
      poBox: "S.L.P",
      phoneNumber: "Namba ya simu ya mkononi",
      email: "Barua pepe",
      landRoverType: "Aina ya Land Rover",
      landRoverModel: "Mfano wa Land Rover",
      applicantProfile: "Wasifu wa mwombaji kwa ufupi",
      howHeardAbout:
        "Umepataje taarifa za Tanzania Land Rover Club; Rafiki, Mwanaklabu, Mtandaoni, Namna Nyingine – taja",
      applicantPhoto: "Picha ya Mwombaji (BANDIKA PICHA)",
      idDocument: "Nakala ya Kadi ya Gari (BANDIKA PICHA)",
      declaration: "Tamko la Mwombaji kwa Club",

      // Guarantor fields
      guarantorName: "Jina la Mdhamini",
      guarantorAddress: "Anuani kamili",
      guarantorPhone: "Namba ya simu ya Mkononi",
      guarantorEmail: "Barua pepe",
      guarantorDescription: "Maelezo ya mdhamini kwa mdhaminiwa",

      // Buttons
      backToPlans: "Rudi Kwenye Mipango",
      downloadPDF: "Pakua PDF",
      downloadODF: "Pakua ODF",
      submitApplication: "Wasilisha Maombi",
      submitting: "Inawasilisha...",

      // Messages
      successMessage: "Maombi ya ujumbe yamewasilishwa kwa mafanikio! Namba ya kumbukumbu:",
      errorMessage: "Kuna hitilafu imetokea. Jaribu tena.",
      validationMessage: "Tafadhali jaza angalau jina lako na taarifa za mawasiliano kabla ya kupakua PDF.",

      // Declaration text
      declarationText:
        "ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.",
      acceptTerms: "Ninakubali tamko hili na masharti yote ya kujiunga na klabu",
    },
    en: {
      // Header
      clubName: "LAND ROVER CLUB TANZANIA",
      formTitle: "MEMBERSHIP APPLICATION FORM",
      membershipPlans: "Membership Plans",
      joinCommunity: "Join Our Community",
      planDescription:
        "Choose the membership level that fits your adventure style. All memberships include access to our supportive community and expert guidance.",

      // Plans
      explorer: "Explorer",
      adventurer: "Adventurer",
      expedition: "Expedition",
      explorerDesc: "Perfect for newcomers to the off-road community",
      adventurerDesc: "For serious off-road enthusiasts",
      expeditionDesc: "Ultimate membership for expedition leaders",

      // Form sections
      applicantInfo: "APPLICANT AND GUARANTOR INFORMATION",
      personalInfo: "PERSONAL INFORMATION",
      guarantorInfo: "GUARANTOR",
      membershipTerms: "MEMBERSHIP TERMS",
      feesContributions: "FEES AND CONTRIBUTIONS",

      // Form fields
      applicantName: "Applicant Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      male: "Male",
      female: "Female",
      fullAddress: "Full Address",
      poBox: "P.O. Box",
      phoneNumber: "Mobile Phone Number",
      email: "Email Address",
      landRoverType: "Land Rover Type",
      landRoverModel: "Land Rover Model",
      applicantProfile: "Brief applicant profile",
      howHeardAbout: "How did you hear about Tanzania Land Rover Club; Friend, Club Member, Online, Other - specify",
      applicantPhoto: "Applicant Photo (ATTACH PHOTO)",
      idDocument: "Copy of Vehicle Registration (ATTACH PHOTO)",
      declaration: "Applicant Declaration to Club",

      // Guarantor fields
      guarantorName: "Guarantor Name",
      guarantorAddress: "Full address",
      guarantorPhone: "Mobile Phone Number",
      guarantorEmail: "Email Address",
      guarantorDescription: "Guarantor description of the applicant",

      // Buttons
      backToPlans: "Back to Plans",
      downloadPDF: "Download PDF",
      downloadODF: "Download ODF",
      submitApplication: "Submit Application",
      submitting: "Submitting...",

      // Messages
      successMessage: "Membership application submitted successfully! Reference number:",
      errorMessage: "An error occurred. Please try again.",
      validationMessage: "Please fill in at least your name and contact information before downloading PDF.",

      // Declaration text
      declarationText:
        "hereby apply to join the Tanzania Land Rover Club, I promise to be faithful and fulfill all the conditions contained in the Constitution, Rules and Procedures of the Club if my application is accepted. I acknowledge that all the information I have written in this form is true and correct.",
      acceptTerms: "I accept this declaration and all terms of joining the club",
    },
  }

  const t = translations[language]

  // Track user's assigned reference number locally
  const [userReferenceNumber, setUserReferenceNumber] = useState<string>("")

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

  // Generate reference number when form is shown
  useEffect(() => {
    if (showForm && !userReferenceNumber) {
      const storedRefNumber = localStorage.getItem("lrct_user_reference_number")
      if (storedRefNumber) {
        setUserReferenceNumber(storedRefNumber)
      } else {
        // Generate a new reference number
        const currentYear = new Date().getFullYear()
        const timestamp = Date.now().toString().slice(-6)
        const newRefNumber = `LRCT/Adm/${currentYear}/${timestamp}`
        setUserReferenceNumber(newRefNumber)
        localStorage.setItem("lrct_user_reference_number", newRefNumber)
      }
    }
  }, [showForm, userReferenceNumber])

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

  const landRoverTypes = [
    { value: "defender", label: "Defender" },
    { value: "discovery", label: "Discovery" },
    { value: "range-rover", label: "Range Rover" },
    { value: "freelander", label: "Freelander" },
    { value: "evoque", label: "Evoque" },
    { value: "velar", label: "Velar" },
    { value: "sport", label: "Range Rover Sport" },
  ]

  const landRoverModels = {
    defender: [
      { value: "defender-90", label: "Defender 90" },
      { value: "defender-110", label: "Defender 110" },
      { value: "defender-130", label: "Defender 130" },
      { value: "defender-classic", label: "Defender Classic" },
    ],
    discovery: [
      { value: "discovery-1", label: "Discovery 1" },
      { value: "discovery-2", label: "Discovery 2" },
      { value: "discovery-3", label: "Discovery 3" },
      { value: "discovery-4", label: "Discovery 4" },
      { value: "discovery-5", label: "Discovery 5" },
      { value: "discovery-sport", label: "Discovery Sport" },
    ],
    "range-rover": [
      { value: "range-rover-classic", label: "Range Rover Classic" },
      { value: "range-rover-p38", label: "Range Rover P38" },
      { value: "range-rover-l322", label: "Range Rover L322" },
      { value: "range-rover-l405", label: "Range Rover L405" },
      { value: "range-rover-l460", label: "Range Rover L460" },
    ],
    freelander: [
      { value: "freelander-1", label: "Freelander 1" },
      { value: "freelander-2", label: "Freelander 2" },
    ],
    evoque: [
      { value: "evoque-3-door", label: "Evoque 3-door" },
      { value: "evoque-5-door", label: "Evoque 5-door" },
      { value: "evoque-convertible", label: "Evoque Convertible" },
    ],
    velar: [
      { value: "velar-standard", label: "Velar Standard" },
      { value: "velar-svr", label: "Velar SVR" },
    ],
    sport: [
      { value: "sport-l320", label: "Range Rover Sport L320" },
      { value: "sport-l494", label: "Range Rover Sport L494" },
      { value: "sport-l461", label: "Range Rover Sport L461" },
      { value: "sport-svr", label: "Range Rover Sport SVR" },
    ],
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    const fieldName = e.target.id
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }))
  }

  const handleLandRoverTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      landRoverType: value,
      landRoverModel: "", // Reset model when type changes
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare form data for email
      const selectedType = landRoverTypes.find((type) => type.value === formData.landRoverType)
      const selectedModel =
        formData.landRoverType &&
        landRoverModels[formData.landRoverType]?.find((model) => model.value === formData.landRoverModel)

      const emailData = {
        to: "info@landroverclub.or.tz",
        subject: `New Membership Application - ${formData.jinaLaMwombaji} (${userReferenceNumber})`,
        html: `
        <h2>New Membership Application</h2>
        <p><strong>Reference Number:</strong> ${userReferenceNumber}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h3>Applicant Information</h3>
        <p><strong>Name:</strong> ${formData.jinaLaMwombaji}</p>
        <p><strong>Date of Birth:</strong> ${formData.tareheyaKuzaliwa}</p>
        <p><strong>Gender:</strong> ${formData.jinsia === "me" ? "Male" : formData.jinsia === "ke" ? "Female" : ""}</p>
        <p><strong>Address:</strong> ${formData.anuaniKamili}</p>
        <p><strong>P.O. Box:</strong> ${formData.slp}</p>
        <p><strong>Phone:</strong> ${formData.nambaYaSimu}</p>
        <p><strong>Email:</strong> ${formData.baruaPepe}</p>
        <p><strong>Land Rover Type:</strong> ${selectedType?.label || ""}</p>
        <p><strong>Land Rover Model:</strong> ${selectedModel?.label || ""}</p>
        <p><strong>Profile:</strong> ${formData.wasifuWaMwombaji}</p>
        <p><strong>How heard about club:</strong> ${formData.umepatajeTaarifa}</p>
        
        <h3>Guarantor Information</h3>
        <p><strong>Name:</strong> ${formData.jinaLaMdhamini}</p>
        <p><strong>Address:</strong> ${formData.anuaniYaMdhamini}</p>
        <p><strong>P.O. Box:</strong> ${formData.slpYaMdhamini}</p>
        <p><strong>Phone:</strong> ${formData.nambaYaSimuYaMdhamini}</p>
        <p><strong>Email:</strong> ${formData.baruaPepeYaMdhamini}</p>
        <p><strong>Description:</strong> ${formData.malezoYaMdhamini}</p>
        
        <p><em>Please find attached documents and photos in the applicant's submission.</em></p>
      `,
      }

      // Send email using a service (you'll need to implement this)
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      })

      if (response.ok) {
        alert(`${t.successMessage} ${userReferenceNumber}`)

        // Clear form data
        setFormData({
          jinaLaMwombaji: "",
          tareheyaKuzaliwa: "",
          jinsia: "",
          anuaniKamili: "",
          slp: "",
          nambaYaSimu: "",
          baruaPepe: "",
          landRoverType: "",
          landRoverModel: "",
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
          kitambulisho: null,
          termsAccepted: false,
        })

        // Clear stored reference number after submission
        setUserReferenceNumber("")
        localStorage.removeItem("lrct_user_reference_number")
        setShowForm(false)
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert(t.errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Enhanced PDF generation with club logo
  const generatePDF = async () => {
    const currentDate = new Date().toLocaleDateString("sw-TZ")

    // Create PDF in portrait A4 format
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Validation - check critical fields
    const criticalFields = [formData.jinaLaMwombaji, formData.nambaYaSimu, formData.baruaPepe, formData.termsAccepted]

    const isComplete = criticalFields.every((field) => (typeof field === "boolean" ? field === true : !!field))

    if (!isComplete) {
      alert(t.validationMessage)
      return
    }

    // Set default font
    doc.setFont("helvetica", "normal")

    // Define page margins
    const pageMargin = 15

    // ------------ HEADER SECTION WITH CLUB LOGO ------------

    // Add club logo
    try {
      // Load the club logo from your images folder
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.src = "/images/lrct-logo.png" // Path to your logo

      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          try {
            // Add logo to PDF - positioned on the left side
            const logoWidth = 30
            const logoHeight = 30
            doc.addImage(logoImg, "PNG", pageMargin, pageMargin, logoWidth, logoHeight)
            resolve(true)
          } catch (err) {
            console.log("Error adding logo to PDF:", err)
            // If logo fails, create a simple placeholder
            doc.setFillColor(34, 197, 94) // Green color
            doc.circle(pageMargin + 15, pageMargin + 15, 15, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(12)
            doc.setFont("helvetica", "bold")
            doc.text("LRCT", pageMargin + 15, pageMargin + 18, { align: "center" })
            doc.setTextColor(0, 0, 0) // Reset to black
            resolve(false)
          }
        }
        logoImg.onerror = () => {
          console.log("Could not load logo, using placeholder")
          // Create a simple logo placeholder if image fails to load
          doc.setFillColor(34, 197, 94) // Green color
          doc.circle(pageMargin + 15, pageMargin + 15, 15, "F")
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("LRCT", pageMargin + 15, pageMargin + 18, { align: "center" })
          doc.setTextColor(0, 0, 0) // Reset to black
          resolve(false)
        }
      })
    } catch (error) {
      console.log("Error loading logo:", error)
      // Fallback to simple placeholder
      doc.setFillColor(34, 197, 94) // Green color
      doc.circle(pageMargin + 15, pageMargin + 15, 15, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("LRCT", pageMargin + 15, pageMargin + 18, { align: "center" })
      doc.setTextColor(0, 0, 0) // Reset to black
    }

    // Header - Title & Contact info (positioned to the right of logo)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("LAND ROVER CLUB TANZANIA", 105, pageMargin + 10, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("P. O. BOX 77, MOROGORO. TANZANIA", 105, pageMargin + 18, { align: "center" })
    doc.text("TEL; +255 763 652 641/+255 718 133 333", 105, pageMargin + 24, { align: "center" })
    doc.text("Email; info@landroverclub.or.tz", 105, pageMargin + 30, { align: "center" })

    // Add horizontal line under header
    doc.setDrawColor(0)
    doc.setLineWidth(0.5)
    doc.line(pageMargin, pageMargin + 40, 195, pageMargin + 40)

    // Form title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("FOMU YA KUJIUNGA NA UANACHAMA", 105, pageMargin + 50, { align: "center" })

    // Reference and Date
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Kumb Na. ${userReferenceNumber}`, pageMargin, pageMargin + 60)
    doc.text(`Tarehe ${currentDate}`, 150, pageMargin + 60)

    // Add photo frame
    const pageWidth = doc.internal.pageSize.getWidth()
    const photoFrameX = pageWidth - pageMargin - 45
    const photoFrameY = pageMargin + 45
    const photoWidth = 40
    const photoHeight = 50

    // Label for photo
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("PICHA YA MWOMBAJI", photoFrameX + photoWidth / 2, photoFrameY - 5, { align: "center" })
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)

    // Draw photo frame border
    doc.setDrawColor(0)
    doc.setLineWidth(0.3)
    doc.rect(photoFrameX, photoFrameY, photoWidth, photoHeight)

    // Add user's uploaded photo if available
    if (formData.picha) {
      try {
        const photoImg = new Image()
        photoImg.crossOrigin = "anonymous"
        photoImg.src = URL.createObjectURL(formData.picha)

        await new Promise((resolve) => {
          photoImg.onload = () => {
            try {
              const canvas = document.createElement("canvas")
              const ctx = canvas.getContext("2d")
              if (!ctx) throw new Error("Unable to get 2D context")

              canvas.width = 150
              canvas.height = 200

              ctx.fillStyle = "white"
              ctx.fillRect(0, 0, canvas.width, canvas.height)

              const imgAspect = photoImg.width / photoImg.height
              const canvasAspect = canvas.width / canvas.height

              let drawWidth, drawHeight, offsetX, offsetY

              if (imgAspect > canvasAspect) {
                drawWidth = canvas.width
                drawHeight = canvas.width / imgAspect
                offsetX = 0
                offsetY = (canvas.height - drawHeight) / 2
              } else {
                drawWidth = canvas.height * imgAspect
                drawHeight = canvas.height
                offsetX = (canvas.width - drawWidth) / 2
                offsetY = 0
              }

              ctx.drawImage(photoImg, offsetX, offsetY, drawWidth, drawHeight)
              const photoDataURL = canvas.toDataURL("image/png")

              doc.addImage(photoDataURL, "PNG", photoFrameX, photoFrameY, photoWidth, photoHeight)
              resolve(true)
            } catch (err) {
              console.log("Error processing uploaded photo:", err)
              resolve(false)
            }
          }
          photoImg.onerror = () => resolve(false)
        })
      } catch (error) {
        console.log("Error loading uploaded photo:", error)
      }
    }

    let yPos = pageMargin + 100

    // PART A: MAELEZO YA MWOMBAJI NA MDHAMINI
    doc.setFillColor(220, 220, 220)
    doc.rect(pageMargin, yPos, 180, 8, "F")

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("A. MAELEZO YA MWOMBAJI NA MDHAMINI", pageMargin + 2, yPos + 6)
    yPos += 15

    // Section 1: TAARIFA BINAFSI
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("1. TAARIFA BINAFSI", pageMargin, yPos)
    yPos += 10

    doc.setFontSize(11)

    const lineWidth = 130
    const labelWidth = 55

    // Helper function to add form field
    const addFormField = (label: string, value: string, yPosition: number) => {
      doc.setFont("helvetica", "bold")
      doc.text(label, pageMargin, yPosition)
      doc.setFont("helvetica", "normal")

      doc.setLineWidth(0.1)
      doc.line(pageMargin + labelWidth, yPosition, pageMargin + labelWidth + lineWidth, yPosition)

      if (value) {
        const lines = doc.splitTextToSize(value, lineWidth - 5)
        doc.text(lines, pageMargin + labelWidth + 2, yPosition - 1)
      }
      return yPosition + 8
    }

    // Add all form fields with complete data
    yPos = addFormField("1.1 Jina la Mwombaji: ", formData.jinaLaMwombaji, yPos)
    yPos = addFormField("1.2 Tarehe ya Kuzaliwa: ", formData.tareheyaKuzaliwa, yPos)

    // Gender with checkboxes
    doc.setFont("helvetica", "bold")
    doc.text("1.3 Jinsia: ", pageMargin, yPos)
    doc.setFont("helvetica", "normal")

    const checkboxSize = 4

    // Me checkbox
    doc.rect(pageMargin + labelWidth, yPos - checkboxSize, checkboxSize, checkboxSize)
    doc.text("Me", pageMargin + labelWidth + checkboxSize + 2, yPos)

    // Ke checkbox
    doc.rect(pageMargin + labelWidth + 25, yPos - checkboxSize, checkboxSize, checkboxSize)
    doc.text("Ke", pageMargin + labelWidth + 25 + checkboxSize + 2, yPos)

    // Mark the selected gender with a proper checkmark
    if (formData.jinsia === "me") {
      doc.setFont("helvetica", "bold")
      doc.text("✓", pageMargin + labelWidth + 1, yPos - 0.5)
      doc.setFont("helvetica", "normal")
    } else if (formData.jinsia === "ke") {
      doc.setFont("helvetica", "bold")
      doc.text("✓", pageMargin + labelWidth + 26, yPos - 0.5)
      doc.setFont("helvetica", "normal")
    }
    yPos += 8

    // Address fields
    doc.setFont("helvetica", "bold")
    doc.text("1.4 Anuani Kamili: S.L.P ", pageMargin, yPos)
    doc.setFont("helvetica", "normal")

    const slpLineWidth = 30
    doc.line(pageMargin + labelWidth, yPos, pageMargin + labelWidth + slpLineWidth, yPos)

    if (formData.slp) {
      doc.text(formData.slp, pageMargin + labelWidth + 2, yPos - 1)
    }
    yPos += 8

    doc.line(pageMargin, yPos, pageMargin + 180, yPos)

    if (formData.anuaniKamili) {
      const addressLines = doc.splitTextToSize(formData.anuaniKamili, 180)
      doc.text(addressLines, pageMargin + 2, yPos - 1)
    }
    yPos += 8

    // Contact Information
    doc.setFont("helvetica", "bold")
    doc.text("Namba ya simu: ", pageMargin, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + 35, yPos, pageMargin + 110, yPos)

    if (formData.nambaYaSimu) {
      doc.text(formData.nambaYaSimu, pageMargin + 35 + 2, yPos - 1)
    }

    doc.setFont("helvetica", "bold")
    doc.text("Barua pepe: ", pageMargin + 115, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + 145, yPos, pageMargin + 195, yPos)

    if (formData.baruaPepe) {
      const emailText =
        formData.baruaPepe.length > 25 ? formData.baruaPepe.substring(0, 23) + "..." : formData.baruaPepe

      doc.text(emailText, pageMargin + 145 + 2, yPos - 1)
    }
    yPos += 12

    // Land Rover Information
    doc.setFont("helvetica", "bold")
    doc.text("Aina ya Land Rover: ", pageMargin, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + 45, yPos, pageMargin + 110, yPos)

    const selectedType = landRoverTypes.find((type) => type.value === formData.landRoverType)
    if (selectedType?.label) {
      doc.text(selectedType.label, pageMargin + 45 + 2, yPos - 1)
    }

    doc.setFont("helvetica", "bold")
    doc.text("Mfano: ", pageMargin + 115, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + 130, yPos, pageMargin + 180, yPos)

    const selectedModel =
      formData.landRoverType &&
      landRoverModels[formData.landRoverType]?.find((model) => model.value === formData.landRoverModel)

    if (selectedModel?.label) {
      doc.text(selectedModel.label, pageMargin + 130 + 2, yPos - 1)
    }
    yPos += 12

    // Profile section
    doc.setFont("helvetica", "bold")
    doc.text("1.5 Wasifu wa mwombaji kwa ufupi:", pageMargin, yPos)
    yPos += 5

    const profileBoxHeight = 20
    doc.rect(pageMargin, yPos, 180, profileBoxHeight)

    doc.setFont("helvetica", "normal")
    if (formData.wasifuWaMwombaji) {
      const wasifuLines = doc.splitTextToSize(formData.wasifuWaMwombaji, 175)
      doc.text(wasifuLines, pageMargin + 2, yPos + 5)
    }
    yPos += profileBoxHeight + 5

    // Information source
    doc.setFont("helvetica", "bold")
    doc.text("1.6 Umepataje taarifa za Tanzania Land Rover Club:", pageMargin, yPos)
    yPos += 5

    const taarifaBoxHeight = 15
    doc.rect(pageMargin, yPos, 180, taarifaBoxHeight)

    doc.setFont("helvetica", "normal")
    if (formData.umepatajeTaarifa) {
      const taarifaLines = doc.splitTextToSize(formData.umepatajeTaarifa, 175)
      doc.text(taarifaLines, pageMargin + 2, yPos + 5)
    }
    yPos += taarifaBoxHeight + 10

    // Declaration
    doc.setFont("helvetica", "bold")
    doc.text("1.7 Tamko la Mwombaji kwa Club:", pageMargin, yPos)
    yPos += 5

    const tamkoBoxHeight = 25
    doc.setDrawColor(0)
    doc.setFillColor(245, 245, 245)
    doc.rect(pageMargin, yPos, 180, tamkoBoxHeight, "FD")

    doc.setFont("helvetica", "normal")
    const tamkoText = `Mimi ${formData.jinaLaMwombaji || "........................"} ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.`
    const tamkoLines = doc.splitTextToSize(tamkoText, 175)
    doc.text(tamkoLines, pageMargin + 2, yPos + 5)
    yPos += tamkoBoxHeight + 10

    // Signature lines
    doc.setFont("helvetica", "bold")
    doc.text("Sahihi ya Mwombaji: ", pageMargin, yPos)
    doc.line(pageMargin + 40, yPos, pageMargin + 100, yPos)

    doc.text("Tarehe: ", pageMargin + 110, yPos)
    doc.line(pageMargin + 130, yPos, pageMargin + 180, yPos)
    doc.text(currentDate, pageMargin + 132, yPos - 1)
    yPos += 15

    // Section 2: MDHAMINI
    doc.setFontSize(12)
    doc.setFillColor(220, 220, 220)
    doc.rect(pageMargin, yPos, 180, 7, "F")
    doc.setFont("helvetica", "bold")
    doc.text("2. MDHAMINI", pageMargin + 2, yPos + 5)
    yPos += 12

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    // Add all guarantor fields
    yPos = addFormField("2.1 Jina la Mdhamini: ", formData.jinaLaMdhamini, yPos)

    // Guarantor address
    doc.setFont("helvetica", "bold")
    doc.text("2.2 Anuani kamili; S.L.P: ", pageMargin, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + labelWidth + 15, yPos, pageMargin + labelWidth + 50, yPos)

    if (formData.slpYaMdhamini) {
      doc.text(formData.slpYaMdhamini, pageMargin + labelWidth + 17, yPos - 1)
    }
    yPos += 8

    doc.line(pageMargin, yPos, pageMargin + 180, yPos)

    if (formData.anuaniYaMdhamini) {
      doc.text(formData.anuaniYaMdhamini, pageMargin + 2, yPos - 1)
    }
    yPos += 8

    // Guarantor contact
    doc.setFont("helvetica", "bold")
    doc.text("Namba ya simu: ", pageMargin, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + 35, yPos, pageMargin + 110, yPos)

    if (formData.nambaYaSimuYaMdhamini) {
      doc.text(formData.nambaYaSimuYaMdhamini, pageMargin + 35 + 2, yPos - 1)
    }

    doc.setFont("helvetica", "bold")
    doc.text("Barua pepe: ", pageMargin + 115, yPos)
    doc.setFont("helvetica", "normal")

    doc.line(pageMargin + 145, yPos, pageMargin + 195, yPos)

    if (formData.baruaPepeYaMdhamini) {
      const emailText =
        formData.baruaPepeYaMdhamini.length > 25
          ? formData.baruaPepeYaMdhamini.substring(0, 23) + "..."
          : formData.baruaPepeYaMdhamini

      doc.text(emailText, pageMargin + 145 + 2, yPos - 1)
    }
    yPos += 12

    // Guarantor description
    doc.setFont("helvetica", "bold")
    doc.text("2.3 Maelezo ya mdhamini kwa mdhaminiwa:", pageMargin, yPos)
    yPos += 5

    const malezoBoxHeight = 20
    doc.rect(pageMargin, yPos, 180, malezoBoxHeight)

    doc.setFont("helvetica", "normal")
    if (formData.malezoYaMdhamini) {
      const malezoLines = doc.splitTextToSize(formData.malezoYaMdhamini, 175)
      doc.text(malezoLines, pageMargin + 2, yPos + 5)
    }
    yPos += malezoBoxHeight + 8

    // Check if we need more space before guarantor signature
    if (yPos > 270) {
      doc.addPage()
      yPos = pageMargin + 10
    }

    // Guarantor signature
    doc.setFont("helvetica", "bold")
    doc.text("2.4 Sahihi ya Mdhamini: ", pageMargin, yPos)
    doc.line(pageMargin + 45, yPos, pageMargin + 100, yPos)

    doc.text("Tarehe: ", pageMargin + 110, yPos)
    doc.text(currentDate, pageMargin + 130, yPos)
    yPos += 15

    // Check if we need a new page for Part B
    if (yPos > 250) {
      doc.addPage()
      yPos = pageMargin + 10
    }

    // PART B: MASHARTI YA KUJIUNGA
    doc.setFontSize(14)
    doc.setFillColor(220, 220, 220)
    doc.rect(pageMargin, yPos, 180, 8, "F")
    doc.setFont("helvetica", "bold")
    doc.text("B. MASHARTI YA KUJIUNGA", pageMargin + 2, yPos + 6)
    yPos += 15

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("3. ADA NA MICHANGO", pageMargin, yPos)
    yPos += 10

    // Fee structure table
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    const tableStartY = yPos
    const colWidths = [15, 65, 30, 70]
    const rowHeight = 10
    const tableBorderWidth = 0.3

    doc.setDrawColor(0)
    doc.setLineWidth(tableBorderWidth)

    const tableWidth = colWidths.reduce((a, b) => a + b, 0)

    // Table header
    doc.setFillColor(230, 230, 230)
    doc.rect(pageMargin, tableStartY, tableWidth, rowHeight, "F")

    // Draw column separators
    let xPos = pageMargin
    doc.line(xPos, tableStartY, xPos, tableStartY + rowHeight)

    xPos += colWidths[0]
    doc.line(xPos, tableStartY, xPos, tableStartY + rowHeight)

    xPos += colWidths[1]
    doc.line(xPos, tableStartY, xPos, tableStartY + rowHeight)

    xPos += colWidths[2]
    doc.line(xPos, tableStartY, xPos, tableStartY + rowHeight)

    doc.line(pageMargin + tableWidth, tableStartY, pageMargin + tableWidth, tableStartY + rowHeight)

    doc.line(pageMargin, tableStartY, pageMargin + tableWidth, tableStartY)
    doc.line(pageMargin, tableStartY + rowHeight, pageMargin + tableWidth, tableStartY + rowHeight)

    // Header text
    doc.setFont("helvetica", "bold")
    doc.text("Na.", pageMargin + colWidths[0] / 2, tableStartY + rowHeight - 3, { align: "center" })
    doc.text("Aina ya Malipo", pageMargin + colWidths[0] + colWidths[1] / 2, tableStartY + rowHeight - 3, {
      align: "center",
    })
    doc.text("Kiwango Tsh", pageMargin + colWidths[0] + colWidths[1] + colWidths[2] / 2, tableStartY + rowHeight - 3, {
      align: "center",
    })
    doc.text(
      "Maelezo",
      pageMargin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] / 2,
      tableStartY + rowHeight - 3,
      { align: "center" },
    )

    // Table data
    const tableData = [
      ["1", "Malipo ya Fomu", "50,000/-", "Inalipwa mara moja wakati wa kuchukua fomu"],
      ["2", "Ada ya Kiingilio kwa Mwombaji", "60,000/-", "Inalipwa mara moja tu (Wakati wa kujiunga na Klabu)"],
      ["3", "Ada ya mwezi", "15,000/-", "Inalipwa kila mwezi (Kati ya Tarehe 1 hadi 5 ya Mwezi)"],
      [
        "4",
        "Michango mbali mbali (Kama Msiba, maradhi, Sare, n.k)",
        "50,000/-",
        "Inaweza kulipwa pamoja na ada ya Kiingilio kwa mwanaklabu anaejiunga ama kati ya mwezi Januari na Juni kwa mwanaklabu aliyekwisha jiunga",
      ],
    ]

    doc.setFont("helvetica", "normal")
    let currentY = tableStartY + rowHeight

    tableData.forEach((row, index) => {
      const cellHeight = Math.max(rowHeight, Math.ceil(row[3].length / 30) * 4 + 5)

      if (index % 2 === 1) {
        doc.setFillColor(245, 245, 245)
        doc.rect(pageMargin, currentY, tableWidth, cellHeight, "F")
      }

      // Draw cell borders
      let xPos = pageMargin
      doc.line(xPos, currentY, xPos, currentY + cellHeight)

      xPos += colWidths[0]
      doc.line(xPos, currentY, xPos, currentY + cellHeight)

      xPos += colWidths[1]
      doc.line(xPos, currentY, xPos, currentY + cellHeight)

      xPos += colWidths[2]
      doc.line(xPos, currentY, xPos, currentY + cellHeight)

      doc.line(pageMargin + tableWidth, currentY, pageMargin + tableWidth, currentY + cellHeight)
      doc.line(pageMargin, currentY + cellHeight, pageMargin + tableWidth, currentY + cellHeight)

      // Add cell content
      doc.text(row[0], pageMargin + colWidths[0] / 2, currentY + 6, { align: "center" })

      const ainaLines = doc.splitTextToSize(row[1], colWidths[1] - 6)
      doc.text(ainaLines, pageMargin + colWidths[0] + 3, currentY + 6)

      doc.text(row[2], pageMargin + colWidths[0] + colWidths[1] + colWidths[2] - 3, currentY + 6, { align: "right" })

      const malezoTableLines = doc.splitTextToSize(row[3], colWidths[3] - 6)
      doc.text(malezoTableLines, pageMargin + colWidths[0] + colWidths[1] + colWidths[2] + 3, currentY + 6)

      currentY += cellHeight
    })

    yPos = currentY + 15

    // Important note
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Muhimu:", 20, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    const muhimuText =
      "Mwanaklabu atatakiwa kulipa michango hii ndani ya siku 14 (kumi na nne) tangia tarehe ya kukubaliwa kuwa mjumbe wa Klabu. Utaratibu wa malipo ya ada na michango utaelekezwa katika barua ya kukubaliwa."
    const muhimuLines = doc.splitTextToSize(muhimuText, 170)
    doc.text(muhimuLines, 20, yPos)
    yPos += muhimuLines.length * 4 + 10

    // Add ID document if available
    if (formData.kitambulisho) {
      try {
        const idImg = new Image()
        idImg.crossOrigin = "anonymous"
        idImg.src = URL.createObjectURL(formData.kitambulisho)

        await new Promise((resolve) => {
          idImg.onload = () => {
            try {
              const canvas = document.createElement("canvas")
              const ctx = canvas.getContext("2d")
              if (!ctx) throw new Error("Unable to get 2D context")

              const maxWidth = 400
              const maxHeight = 250
              const scale = Math.min(maxWidth / idImg.width, maxHeight / idImg.height)
              canvas.width = idImg.width * scale
              canvas.height = idImg.height * scale

              ctx.fillStyle = "white"
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              ctx.drawImage(idImg, 0, 0, canvas.width, canvas.height)

              const idDataURL = canvas.toDataURL("image/png", 0.9)
              const pdfWidth = Math.min(canvas.width * 0.15, 80)
              const pdfHeight = Math.min(canvas.height * 0.15, 60)

              doc.addPage()
              yPos = 30

              doc.setFontSize(12)
              doc.setFont("helvetica", "bold")
              doc.text("Kitambulisho/Hati ya Kusafiria:", 20, yPos)
              yPos += 10

              const xPos = (210 - pdfWidth) / 2
              doc.addImage(idDataURL, "PNG", xPos, yPos, pdfWidth, pdfHeight)
              yPos += pdfHeight + 20

              resolve(true)
            } catch (err) {
              console.log("Error processing ID image:", err)
              resolve(false)
            }
          }
          idImg.onerror = () => resolve(false)
        })
      } catch (error) {
        console.log("Error loading ID image:", error)
      }
    }

    // Final instructions
    if (yPos > 200) {
      doc.addPage()
      yPos = 30
    } else {
      yPos += 20
    }

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Maelekezo ya Mwisho:", 20, yPos)
    yPos += 10

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Maombi haya yatumwe kwa njia ya barua pepe ya Klabu: info@landroverclub.or.tz", 20, yPos)
    yPos += 20

    // Generate QR Code with complete applicant information
    try {
      const selectedType = landRoverTypes.find((type) => type.value === formData.landRoverType)
      const selectedModel =
        formData.landRoverType &&
        landRoverModels[formData.landRoverType]?.find((model) => model.value === formData.landRoverModel)

      const qrData = {
        referenceNumber: userReferenceNumber,
        date: currentDate,
        applicantInfo: {
          name: formData.jinaLaMwombaji,
          dateOfBirth: formData.tareheyaKuzaliwa,
          gender: formData.jinsia === "me" ? "Me" : formData.jinsia === "ke" ? "Ke" : "",
          address: formData.anuaniKamili,
          poBox: formData.slp,
          phone: formData.nambaYaSimu,
          email: formData.baruaPepe,
          landRoverType: selectedType?.label || "",
          landRoverModel: selectedModel?.label || "",
          profile: formData.wasifuWaMwombaji,
          howHeardAboutClub: formData.umepatajeTaarifa,
        },
        guarantorInfo: {
          name: formData.jinaLaMdhamini,
          address: formData.anuaniYaMdhamini,
          poBox: formData.slpYaMdhamini,
          phone: formData.nambaYaSimuYaMdhamini,
          email: formData.baruaPepeYaMdhamini,
          description: formData.malezoYaMdhamini,
        },
        clubInfo: {
          name: "LAND ROVER CLUB TANZANIA",
          address: "P. O. BOX 77, MOROGORO. TANZANIA",
          phone: "+255 763 652 641/+255 718 133 333",
          email: "info@landroverclub.or.tz",
        },
      }

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })

      const pageCount = doc.getNumberOfPages()
      doc.setPage(pageCount)

      if (yPos > 240) {
        doc.addPage()
      }

      const qrSize = 35
      const qrXPos = pageMargin
      const qrYPos = 260 - qrSize

      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text("QR Code ya Taarifa za Mwombaji", qrXPos, qrYPos - 5)

      doc.addImage(qrCodeDataURL, "PNG", qrXPos, qrYPos, qrSize, qrSize)

      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text("Scan QR code hii kupata taarifa", qrXPos + qrSize + 5, qrYPos + 10)
      doc.text("kamili za mwombaji", qrXPos + qrSize + 5, qrYPos + 15)
      doc.text("(Tumia simu yako kupiga picha ya QR code)", qrXPos + qrSize + 5, qrYPos + 20)
    } catch (error) {
      console.log("Error generating QR code:", error)
    }

    // Save the PDF
    doc.save(`LRCT-Application-${formData.jinaLaMwombaji || "Form"}.pdf`)
  }

  // Generate ODF format
  const generateODF = async () => {
    try {
      // Create ODF content as XML
      const currentDate = new Date().toLocaleDateString("sw-TZ")
      const selectedType = landRoverTypes.find((type) => type.value === formData.landRoverType)
      const selectedModel =
        formData.landRoverType &&
        landRoverModels[formData.landRoverType]?.find((model) => model.value === formData.landRoverModel)

      const odfContent = `<?xml version="1.0" encoding="UTF-8"?>
<office:document xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" 
                 xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
                 xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
                 office:mimetype="application/vnd.oasis.opendocument.text">
  <office:body>
    <office:text>
      <text:h text:style-name="Heading1">LAND ROVER CLUB TANZANIA</text:h>
      <text:p>P. O. BOX 77, MOROGORO. TANZANIA</text:p>
      <text:p>TEL; +255 763 652 641/+255 718 133 333</text:p>
      <text:p>Email; info@landroverclub.or.tz</text:p>
      
      <text:h text:style-name="Heading2">FOMU YA KUJIUNGA NA UANACHAMA</text:h>
      
      <text:p>Kumb Na. ${userReferenceNumber}</text:p>
      <text:p>Tarehe ${currentDate}</text:p>
      
      <text:h text:style-name="Heading2">A. MAELEZO YA MWOMBAJI NA MDHAMINI</text:h>
      
      <text:h text:style-name="Heading3">1. TAARIFA BINAFSI</text:h>
      
      <text:p>1.1 Jina la Mwombaji: ${formData.jinaLaMwombaji}</text:p>
      <text:p>1.2 Tarehe ya Kuzaliwa: ${formData.tareheyaKuzaliwa}</text:p>
      <text:p>1.3 Jinsia: ${formData.jinsia === "me" ? "Me" : formData.jinsia === "ke" ? "Ke" : ""}</text:p>
      <text:p>1.4 Anuani Kamili: S.L.P ${formData.slp}</text:p>
      <text:p>${formData.anuaniKamili}</text:p>
      <text:p>Namba ya simu: ${formData.nambaYaSimu}</text:p>
      <text:p>Barua pepe: ${formData.baruaPepe}</text:p>
      <text:p>Aina ya Land Rover: ${selectedType?.label || ""}</text:p>
      <text:p>Mfano: ${selectedModel?.label || ""}</text:p>
      
      <text:p>1.5 Wasifu wa mwombaji kwa ufupi:</text:p>
      <text:p>${formData.wasifuWaMwombaji}</text:p>
      
      <text:p>1.6 Umepataje taarifa za Tanzania Land Rover Club:</text:p>
      <text:p>${formData.umepatajeTaarifa}</text:p>
      
      <text:p>1.7 Tamko la Mwombaji kwa Club:</text:p>
      <text:p>Mimi ${formData.jinaLaMwombaji || "........................"} ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.</text:p>
      
      <text:h text:style-name="Heading3">2. MDHAMINI</text:h>
      
      <text:p>2.1 Jina la Mdhamini: ${formData.jinaLaMdhamini}</text:p>
      <text:p>2.2 Anuani kamili; S.L.P: ${formData.slpYaMdhamini}</text:p>
      <text:p>${formData.anuaniYaMdhamini}</text:p>
      <text:p>Namba ya simu: ${formData.nambaYaSimuYaMdhamini}</text:p>
      <text:p>Barua pepe: ${formData.baruaPepeYaMdhamini}</text:p>
      
      <text:p>2.3 Maelezo ya mdhamini kwa mdhaminiwa:</text:p>
      <text:p>${formData.malezoYaMdhamini}</text:p>
      
      <text:h text:style-name="Heading2">B. MASHARTI YA KUJIUNGA</text:h>
      
      <text:h text:style-name="Heading3">3. ADA NA MICHANGO</text:h>
      
      <text:p>1. Malipo ya Fomu - 50,000/- - Inalipwa mara moja wakati wa kuchukua fomu</text:p>
      <text:p>2. Ada ya Kiingilio kwa Mwombaji - 60,000/- - Inalipwa mara moja tu (Wakati wa kujiunga na Klabu)</text:p>
      <text:p>3. Ada ya mwezi - 15,000/- - Inalipwa kila mwezi (Kati ya Tarehe 1 hadi 5 ya Mwezi)</text:p>
      <text:p>4. Michango mbali mbali (Kama Msiba, maradhi, Sare, n.k) - 50,000/- - Inaweza kulipwa pamoja na ada ya Kiingilio kwa mwanaklabu anaejiunga ama kati ya mwezi Januari na Juni kwa mwanaklabu aliyekwisha jiunga</text:p>
      
      <text:p>Muhimu: Mwanaklabu atatakiwa kulipa michango hii ndani ya siku 14 (kumi na nne) tangia tarehe ya kukubaliwa kuwa mjumbe wa Klabu. Utaratibu wa malipo ya ada na michango utaelekezwa katika barua ya kukubaliwa.</text:p>
      
      <text:p>Maelekezo ya Mwisho: Maombi haya yatumwe kwa njia ya barua pepe ya Klabu: info@landroverclub.or.tz</text:p>
      
    </office:text>
  </office:body>
</office:document>`

      // Create and download ODF file
      const blob = new Blob([odfContent], { type: "application/vnd.oasis.opendocument.text" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `LRCT-Application-${formData.jinaLaMwombaji || "Form"}.odt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating ODF:", error)
      alert("Kuna hitilafu katika kutengeneza faili la ODF. Jaribu tena.")
    }
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
            {t.membershipPlans}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {t.joinCommunity}{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{t.planDescription}</p>
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
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{t.clubName}</h1>
                  <p className="text-sm text-gray-600">P. O. BOX 77, MOROGORO. TANZANIA</p>
                  <p className="text-sm text-gray-600">TEL; +255 763 652 641/+255 718 133 333</p>
                  <p className="text-sm text-gray-600">Email: info@landroverclub.or.tz</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={language === "sw" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("sw")}
                  >
                    SW
                  </Button>
                  <Button
                    type="button"
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                  >
                    EN
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Kumb Na. {userReferenceNumber || "LRCT/Adm/..........."}</span>
                <span>Tarehe {new Date().toLocaleDateString("sw-TZ")}</span>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* A. MAELEZO YA MWOMBAJI NA MDHAMINI */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">A. {t.applicantInfo}</h2>

                  {/* 1. TAARIFA BINAFSI */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">1. {t.personalInfo}</h3>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="jinaLaMwombaji">1.1 {t.applicantName} *</Label>
                        <Input
                          id="jinaLaMwombaji"
                          value={formData.jinaLaMwombaji}
                          onChange={(e) => handleInputChange("jinaLaMwombaji", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="tareheyaKuzaliwa">
                          1.2 {t.dateOfBirth} * (Ambatisha nakala ya Kitambulisho cha Taifa au Hati ya Kusafiria)
                        </Label>
                        <Input
                          id="tareheyaKuzaliwa"
                          type="date"
                          value={formData.tareheyaKuzaliwa}
                          onChange={(e) => handleInputChange("tareheyaKuzaliwa", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>1.3 {t.gender} *</Label>
                        <RadioGroup
                          value={formData.jinsia}
                          onValueChange={(value) => handleInputChange("jinsia", value)}
                          className="flex gap-6 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="me" id="me" />
                            <Label htmlFor="me">{t.male}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ke" id="ke" />
                            <Label htmlFor="ke">{t.female}</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="slp">{t.poBox} *</Label>
                          <Input
                            id="slp"
                            value={formData.slp}
                            onChange={(e) => handleInputChange("slp", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anuaniKamili">1.4 {t.fullAddress} *</Label>
                          <Input
                            id="anuaniKamili"
                            value={formData.anuaniKamili}
                            onChange={(e) => handleInputChange("anuaniKamili", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nambaYaSimu">{t.phoneNumber} *</Label>
                          <Input
                            id="nambaYaSimu"
                            value={formData.nambaYaSimu}
                            onChange={(e) => handleInputChange("nambaYaSimu", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="baruaPepe">{t.email} *</Label>
                          <Input
                            id="baruaPepe"
                            type="email"
                            value={formData.baruaPepe}
                            onChange={(e) => handleInputChange("baruaPepe", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      {/* Land Rover Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="landRoverType">{t.landRoverType} *</Label>
                          <select
                            id="landRoverType"
                            value={formData.landRoverType}
                            onChange={(e) => handleLandRoverTypeChange(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="">Chagua aina ya Land Rover</option>
                            {landRoverTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="landRoverModel">{t.landRoverModel} *</Label>
                          <select
                            id="landRoverModel"
                            value={formData.landRoverModel}
                            onChange={(e) => handleInputChange("landRoverModel", e.target.value)}
                            required
                            disabled={!formData.landRoverType}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          >
                            <option value="">{formData.landRoverType ? "Chagua mfano" : "Chagua aina kwanza"}</option>
                            {formData.landRoverType &&
                              landRoverModels[formData.landRoverType]?.map((model) => (
                                <option key={model.value} value={model.value}>
                                  {model.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="wasifuWaMwombaji">1.5 {t.applicantProfile} *</Label>
                        <Textarea
                          id="wasifuWaMwombaji"
                          value={formData.wasifuWaMwombaji}
                          onChange={(e) => handleInputChange("wasifuWaMwombaji", e.target.value)}
                          required
                          rows={4}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="umepatajeTaarifa">1.6 {t.howHeardAbout} *</Label>
                        <Input
                          id="umepatajeTaarifa"
                          value={formData.umepatajeTaarifa}
                          onChange={(e) => handleInputChange("umepatajeTaarifa", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <Label htmlFor="picha">{t.applicantPhoto} *</Label>
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

                      {/* NIDA/Passport Upload */}
                      <div>
                        <Label htmlFor="kitambulisho">{t.idDocument} *</Label>
                        <div className="mt-2 flex items-center gap-4">
                          <Input
                            id="kitambulisho"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="flex-1"
                          />
                          <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                            {formData.kitambulisho ? (
                              <img
                                src={URL.createObjectURL(formData.kitambulisho) || "/placeholder.svg"}
                                alt="ID Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <FileText className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Pakia nakala ya Kitambulisho cha Taifa (NIDA) au Hati ya Kusafiria
                        </p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">1.7 {t.declaration}:</h4>
                        <p className="text-sm text-gray-700 mb-4">
                          Mimi <strong>{formData.jinaLaMwombaji || "........................"}</strong>{" "}
                          {t.declarationText}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="tamkoAccepted"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                            required
                          />
                          <Label htmlFor="tamkoAccepted" className="text-sm">
                            {t.acceptTerms} *
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. MDHAMINI */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">2. {t.guarantorInfo}</h3>

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label htmlFor="jinaLaMdhamini">2.1 {t.guarantorName} *</Label>
                        <Input
                          id="jinaLaMdhamini"
                          value={formData.jinaLaMdhamini}
                          onChange={(e) => handleInputChange("jinaLaMdhamini", e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="slpYaMdhamini">{t.poBox} *</Label>
                          <Input
                            id="slpYaMdhamini"
                            value={formData.slpYaMdhamini}
                            onChange={(e) => handleInputChange("slpYaMdhamini", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anuaniYaMdhamini">2.2 {t.guarantorAddress} *</Label>
                          <Input
                            id="anuaniYaMdhamini"
                            value={formData.anuaniYaMdhamini}
                            onChange={(e) => handleInputChange("anuaniYaMdhamini", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nambaYaSimuYaMdhamini">{t.guarantorPhone} *</Label>
                          <Input
                            id="nambaYaSimuYaMdhamini"
                            value={formData.nambaYaSimuYaMdhamini}
                            onChange={(e) => handleInputChange("nambaYaSimuYaMdhamini", e.target.value)}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="baruaPepeYaMdhamini">{t.guarantorEmail}</Label>
                          <Input
                            id="baruaPepeYaMdhamini"
                            type="email"
                            value={formData.baruaPepeYaMdhamini}
                            onChange={(e) => handleInputChange("baruaPepeYaMdhamini", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="malezoYaMdhamini">2.3 {t.guarantorDescription} *</Label>
                        <Textarea
                          id="malezoYaMdhamini"
                          value={formData.malezoYaMdhamini}
                          onChange={(e) => handleInputChange("malezoYaMdhamini", e.target.value)}
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">B. {t.membershipTerms}</h3>
                  <h4 className="font-semibold mb-4">3. {t.feesContributions}</h4>

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
                    {t.backToPlans}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePDF}
                    className="flex-1 flex items-center justify-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    {t.downloadPDF}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateODF}
                    className="flex-1 flex items-center justify-center gap-2 bg-transparent"
                  >
                    <FileText className="h-4 w-4" />
                    {t.downloadODF}
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? t.submitting : t.submitApplication}
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
