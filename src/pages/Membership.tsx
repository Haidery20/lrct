"use client"

import React from "react"
import { generateODF } from "../utils/generateODF" // Import the generateODF function
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`Maombi ya ujumbe yamewasilishwa kwa mafanikio! Namba ya kumbukumbu: ${userReferenceNumber}`)

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
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Kuna hitilafu imetokea. Jaribu tena.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate PDF using jsPDF
  const generatePDF = async () => {
    const currentDate = new Date().toLocaleDateString("sw-TZ")
    const doc = new jsPDF()

    const requiredFields = [
      formData.jinaLaMwombaji,
      formData.tareheyaKuzaliwa,
      formData.jinsia,
      formData.anuaniKamili,
      formData.slp,
      formData.nambaYaSimu,
      formData.baruaPepe,
      formData.landRoverType,
      formData.landRoverModel,
      formData.wasifuWaMwombaji,
      formData.umepatajeTaarifa,
      formData.tamkoLaMwombaji,
      formData.jinaLaMdhamini,
      formData.anuaniYaMdhamini,
      formData.slpYaMdhamini,
      formData.nambaYaSimuYaMdhamini,
      formData.malezoYaMdhamini,
      formData.picha,
      formData.kitambulisho,
      formData.termsAccepted,
    ]
  
    // Check for any missing values
    const isComplete = requiredFields.every((field) =>
      typeof field === "boolean" ? field === true : !!field
    )
  
    if (!isComplete) {
      alert("Tafadhali jaza sehemu zote muhimu kabla ya kupakua PDF.")
      return
    }

    // Set font
    doc.setFont("helvetica", "normal")

    // Add club logo in the left top corner
    try {
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"
      logoImg.src = "/images/club_logo.svg"

      await new Promise((resolve, reject) => {
        logoImg.onload = () => {
          try {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d");
            if (ctx === null) {
              throw new Error("Unable to get 2D context");
            }
            canvas.width = 120
            canvas.height = 120

            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height)

            const dataURL = canvas.toDataURL("image/png")
            doc.addImage(dataURL, "PNG", 10, 10, 30, 30)
            resolve(true)
          } catch (err) {
            console.log("Error processing logo:", err)
            resolve(false)
          }
        }
        logoImg.onerror = () => {
          console.log("Could not load logo image")
          resolve(false)
        }
      })
    } catch (error) {
      console.log("Could not load logo:", error)
    }

    // Header
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("LAND ROVER CLUB TANZANIA", 105, 20, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("P. O. BOX 77, MOROGORO. TANZANIA", 105, 28, { align: "center" })
    doc.text("TEL; +255 763 652 641/+255 718 133 333", 105, 34, { align: "center" })
    doc.text("Email; landroverclubtz@gmail.com", 105, 40, { align: "center" })

    // Reference and Date
    doc.setFontSize(11)
    doc.text(`Kumb Na. ${userReferenceNumber}`, 20, 55)
    doc.text(`Tarehe ${currentDate}`, 150, 55)

    // Add user's uploaded photo if available (right side of page)
    if (formData.picha) {
      try {
        const photoImg = new Image()
        photoImg.src = URL.createObjectURL(formData.picha)

        await new Promise((resolve, reject) => {
          photoImg.onload = () => {
            try {
              const canvas = document.createElement("canvas")
              const ctx = canvas.getContext("2d");
              if (ctx === null) {
                throw new Error("Unable to get 2D context");
              }
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
                offsetY = (canvas.height - drawWidth) / 2
              } else {
                drawWidth = canvas.height * imgAspect
                drawHeight = canvas.height
                offsetX = (canvas.width - drawWidth) / 2
                offsetY = 0
              }

              ctx.drawImage(photoImg, offsetX, offsetY, drawWidth, drawHeight)
              const photoDataURL = canvas.toDataURL("image/png")

              doc.addImage(photoDataURL, "PNG", 160, 65, 35, 47)
              doc.setFontSize(8)
              // Move caption slightly lower and ensure it's within photo bounds
              doc.text("Picha ya Mwombaji", 160, 118)

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

    let yPos = 70

    // PART A: MAELEZO YA MWOMBAJI NA MDHAMINI
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("A. MAELEZO YA MWOMBAJI NA MDHAMINI", 20, yPos)
    yPos += 10

    // Section 1: TAARIFA BINAFSI
    doc.setFontSize(12)
    doc.text("1. TAARIFA BINAFSI", 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    // 1.1 Jina la Mwombaji
    doc.setFont("helvetica", "bold")
    doc.text("1.1 Jina la Mwombaji: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.jinaLaMwombaji, 70, yPos)
    yPos += 6

    // 1.2 Tarehe ya Kuzaliwa
    doc.setFont("helvetica", "bold")
    doc.text("1.2 Tarehe ya Kuzaliwa: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.tareheyaKuzaliwa, 75, yPos)
    yPos += 6

    // 1.3 Jinsia
    doc.setFont("helvetica", "bold")
    doc.text("1.3 Jinsia: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    const jinsiaText = formData.jinsia === "me" ? "Me ✓" : formData.jinsia === "ke" ? "Ke ✓" : ""
    doc.text(jinsiaText, 50, yPos)
    yPos += 6

    // 1.4 Anuani Kamili
    doc.setFont("helvetica", "bold")
    doc.text("1.4 Anuani Kamili: S.L.P ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.slp, 75, yPos)
    yPos += 5
    doc.text(formData.anuaniKamili, 20, yPos)
    yPos += 6

    // Contact Information - adjust positioning to avoid overlap with photo
    doc.setFont("helvetica", "bold")
    doc.text("Namba ya simu: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.nambaYaSimu, 55, yPos)

    // Check if there's a photo to avoid overlap
    if (formData.picha) {
      // If photo exists, put email on next line to avoid overlap
      yPos += 6
      doc.setFont("helvetica", "bold")
      doc.text("Barua pepe: ", 20, yPos)
      doc.setFont("helvetica", "normal")
      // Limit email text width to avoid photo area
      const emailText = doc.splitTextToSize(formData.baruaPepe, 130)
      doc.text(emailText, 55, yPos)
      yPos += emailText.length * 4 + 2
    } else {
      // If no photo, can use the full width
      doc.setFont("helvetica", "bold")
      doc.text("Barua pepe: ", 110, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(formData.baruaPepe, 135, yPos)
      yPos += 6
    }
    yPos += 2

    // Land Rover Information
    doc.setFont("helvetica", "bold")
    doc.text("Aina ya Land Rover: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    const selectedType = landRoverTypes.find((type) => type.value === formData.landRoverType)
    doc.text(selectedType?.label || "", 65, yPos)
    doc.setFont("helvetica", "bold")
    doc.text("Mfano: ", 110, yPos)
    doc.setFont("helvetica", "normal")
    const selectedModel =
      formData.landRoverType &&
      landRoverModels[formData.landRoverType]?.find((model) => model.value === formData.landRoverModel)
    doc.text(selectedModel?.label || "", 125, yPos)
    yPos += 8

    // 1.5 Wasifu wa mwombaji
    doc.setFont("helvetica", "bold")
    doc.text("1.5 Wasifu wa mwombaji kwa ufupi:", 20, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    const wasifuLines = doc.splitTextToSize(formData.wasifuWaMwombaji, 170)
    doc.text(wasifuLines, 20, yPos)
    yPos += wasifuLines.length * 4 + 5

    // 1.6 Umepataje taarifa
    doc.setFont("helvetica", "bold")
    doc.text("1.6 Umepataje taarifa za Tanzania Land Rover Club:", 20, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    const taarifaLines = doc.splitTextToSize(formData.umepatajeTaarifa, 170)
    doc.text(taarifaLines, 20, yPos)
    yPos += taarifaLines.length * 4 + 8

    // 1.7 Tamko la Mwombaji
    doc.setFont("helvetica", "bold")
    doc.text("1.7 Tamko la Mwombaji kwa Club:", 20, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    const tamkoText = `Mimi ${formData.jinaLaMwombaji || "........................"} ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote nilizoziandika kwenye fomu hii ni za kweli na sahihi.`
    const tamkoLines = doc.splitTextToSize(tamkoText, 170)
    doc.text(tamkoLines, 20, yPos)
    yPos += tamkoLines.length * 4 + 8

    // Section 2: MDHAMINI
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("2. MDHAMINI", 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    // 2.1 Jina la Mdhamini
    doc.setFont("helvetica", "bold")
    doc.text("2.1 Jina la Mdhamini: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.jinaLaMdhamini, 70, yPos)
    yPos += 6

    // 2.2 Anuani ya Mdhamini
    doc.setFont("helvetica", "bold")
    doc.text("2.2 Anuani kamili; S.L.P: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.slpYaMdhamini, 80, yPos)
    yPos += 5
    doc.text(formData.anuaniYaMdhamini, 20, yPos)
    yPos += 6

    // Mdhamini Contact
    doc.setFont("helvetica", "bold")
    doc.text("Namba ya simu: ", 20, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.nambaYaSimuYaMdhamini, 55, yPos)
    doc.setFont("helvetica", "bold")
    doc.text("Barua pepe: ", 110, yPos)
    doc.setFont("helvetica", "normal")
    doc.text(formData.baruaPepeYaMdhamini, 135, yPos)
    yPos += 8

    // 2.3 Maelezo ya mdhamini
    doc.setFont("helvetica", "bold")
    doc.text("2.3 Maelezo ya mdhamini kwa mdhaminiwa:", 20, yPos)
    yPos += 5
    doc.setFont("helvetica", "normal")
    const malezoLines = doc.splitTextToSize(formData.malezoYaMdhamini, 170)
    doc.text(malezoLines, 20, yPos)
    yPos += malezoLines.length * 4 + 5

    // 2.4 Sahihi ya Mdhamini
    doc.setFont("helvetica", "bold")
    doc.text("2.4 Sahihi ya Mdhamini .................. ", 20, yPos)
    doc.text(`Tarehe ${currentDate}`, 120, yPos)
    yPos += 10

    // Force new page for Part B
    doc.addPage()
    yPos = 20

    // PART B: MASHARTI YA KUJIUNGA
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("B. MASHARTI YA KUJIUNGA", 20, yPos)
    yPos += 10

    doc.setFontSize(12)
    doc.text("3. ADA NA MICHANGO", 20, yPos)
    yPos += 10

    // Create table for contributions
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")

    // Table headers
    const tableStartY = yPos
    const colWidths = [15, 60, 30, 85]
    const rowHeight = 8

    // Draw table borders and headers
    doc.setFont("helvetica", "bold")
    doc.rect(20, tableStartY, colWidths[0], rowHeight) // Na.
    doc.rect(20 + colWidths[0], tableStartY, colWidths[1], rowHeight) // Aina ya Malipo
    doc.rect(20 + colWidths[0] + colWidths[1], tableStartY, colWidths[2], rowHeight) // Kiwango
    doc.rect(20 + colWidths[0] + colWidths[1] + colWidths[2], tableStartY, colWidths[3], rowHeight) // Maelezo

    // Header text
    doc.text("Na.", 22, tableStartY + 5)
    doc.text("Aina ya Malipo", 22 + colWidths[0], tableStartY + 5)
    doc.text("Kiwango Tsh", 22 + colWidths[0] + colWidths[1], tableStartY + 5)
    doc.text("Maelezo", 22 + colWidths[0] + colWidths[1] + colWidths[2], tableStartY + 5)

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
      const cellHeight = Math.max(rowHeight, Math.ceil(row[3].length / 40) * 4 + 4)

      // Draw cell borders
      doc.rect(20, currentY, colWidths[0], cellHeight)
      doc.rect(20 + colWidths[0], currentY, colWidths[1], cellHeight)
      doc.rect(20 + colWidths[0] + colWidths[1], currentY, colWidths[2], cellHeight)
      doc.rect(20 + colWidths[0] + colWidths[1] + colWidths[2], currentY, colWidths[3], cellHeight)

      // Add cell content
      doc.text(row[0], 22, currentY + 5)

      // Handle multi-line text for "Aina ya Malipo"
      const ainaLines = doc.splitTextToSize(row[1], colWidths[1] - 4)
      doc.text(ainaLines, 22 + colWidths[0], currentY + 5)

      doc.text(row[2], 22 + colWidths[0] + colWidths[1], currentY + 5)

      // Handle multi-line text for "Maelezo"
      const malezoTableLines = doc.splitTextToSize(row[3], colWidths[3] - 4)
      doc.text(malezoTableLines, 22 + colWidths[0] + colWidths[1] + colWidths[2], currentY + 5)

      currentY += cellHeight
    })

    yPos = currentY + 10

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

    // Add NIDA/Passport attachment if available
    if (formData.kitambulisho) {
      try {
        const idImg = new Image()
        idImg.src = URL.createObjectURL(formData.kitambulisho)

        await new Promise((resolve, reject) => {
          idImg.onload = () => {
            try {
              const canvas = document.createElement("canvas")
              const ctx = canvas.getContext("2d");
              if (ctx === null) {
                throw new Error("Unable to get 2D context");
              }

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

              // Add new page for ID document
              doc.addPage()
              yPos = 30

              doc.setFontSize(12)
              doc.setFont("helvetica", "bold")
              doc.text("Kitambulisho/Hati ya Kusafiria:", 20, yPos)
              yPos += 10

              // Center the ID image
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

    // Add final instructions on a new page or current page with proper spacing
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
    doc.text("Maombi haya yatumwe kwa njia ya barua pepe ya Klabu: landroverclubtz@gmail.com", 20, yPos)
    yPos += 20

    // Generate QR Code with applicant information
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
          email: "landroverclubtz@gmail.com",
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

      // Check if we need a new page for QR code
      if (yPos > 200) {
        doc.addPage()
        yPos = 30
      }

      // Add QR code section with proper spacing and centering
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("QR Code ya Taarifa za Mwombaji", 105, yPos, { align: "center" })
      yPos += 15

      // Center the QR code
      const qrSize = 50
      const qrXPos = (210 - qrSize) / 2
      doc.addImage(qrCodeDataURL, "PNG", qrXPos, yPos, qrSize, qrSize)
      yPos += qrSize + 10

      // Add QR code description
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text("Scan QR code hii kupata taarifa kamili za mwombaji", 105, yPos, { align: "center" })
      yPos += 8
      doc.text("(Tumia simu yako kupiga picha ya QR code)", 105, yPos, { align: "center" })
    } catch (error) {
      console.log("Error generating QR code:", error)
    }

    // Save as PDF
    doc.save(`LRCT-Application-${formData.jinaLaMwombaji || "Form"}.pdf`)
  }

  // Add the missing imports and UI components at the top

  // Add the complete return statement with all form sections
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
                <span>Kumb Na. {userReferenceNumber || "LRCT/Adm/..........."}</span>
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
                          onChange={(e: { target: { value: any } }) =>
                            handleInputChange("jinaLaMwombaji", e.target.value)
                          }
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
                          onChange={(e: { target: { value: any } }) =>
                            handleInputChange("tareheyaKuzaliwa", e.target.value)
                          }
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
                            onChange={(e: { target: { value: any } }) =>
                              handleInputChange("anuaniKamili", e.target.value)
                            }
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
                            onChange={(e: { target: { value: any } }) =>
                              handleInputChange("nambaYaSimu", e.target.value)
                            }
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

                      {/* Land Rover Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="landRoverType">Aina ya Land Rover *</Label>
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
                          <Label htmlFor="landRoverModel">Mfano wa Land Rover *</Label>
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
                        <Label htmlFor="wasifuWaMwombaji">1.5 Wasifu wa mwombaji kwa ufupi *</Label>
                        <Textarea
                          id="wasifuWaMwombaji"
                          value={formData.wasifuWaMwombaji}
                          onChange={(e: { target: { value: any } }) =>
                            handleInputChange("wasifuWaMwombaji", e.target.value)
                          }
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
                          onChange={(e: { target: { value: any } }) =>
                            handleInputChange("umepatajeTaarifa", e.target.value)
                          }
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

                      {/* NIDA/Passport Upload */}
                      <div>
                        <Label htmlFor="kitambulisho">
                          Nakala ya Kitambulisho cha Taifa au Hati ya Kusafiria (BANDIKA PICHA) *
                        </Label>
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
                          onChange={(e: { target: { value: any } }) =>
                            handleInputChange("jinaLaMdhamini", e.target.value)
                          }
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
                            onChange={(e: { target: { value: any } }) =>
                              handleInputChange("slpYaMdhamini", e.target.value)
                            }
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="anuaniYaMdhamini">2.2 Anuani kamili *</Label>
                          <Input
                            id="anuaniYaMdhamini"
                            value={formData.anuaniYaMdhamini}
                            onChange={(e: { target: { value: any } }) =>
                              handleInputChange("anuaniYaMdhamini", e.target.value)
                            }
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
                            onChange={(e: { target: { value: any } }) =>
                              handleInputChange("nambaYaSimuYaMdhamini", e.target.value)
                            }
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
                            onChange={(e: { target: { value: any } }) =>
                              handleInputChange("baruaPepeYaMdhamini", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="malezoYaMdhamini">2.3 Maelezo ya mdhamini kwa mdhaminiwa *</Label>
                        <Textarea
                          id="malezoYaMdhamini"
                          value={formData.malezoYaMdhamini}
                          onChange={(e: { target: { value: any } }) =>
                            handleInputChange("malezoYaMdhamini", e.target.value)
                          }
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
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? "Inawasilisha..." : "Wasilisha Maombi"}
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
