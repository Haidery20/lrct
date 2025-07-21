"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Check, Star, Users, Shield, Download, Upload } from "lucide-react"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Maombi ya ujumbe yamewasilishwa kwa mafanikio!")
  }

  const generatePDF = () => {
    const currentDate = new Date().toLocaleDateString("sw-TZ")
    const pdfContent = `
                                                            
                                                                                                                      
                                      
 
      LAND ROVER CLUB TANZANIA 
 P. O. BOX 77, MOROGORO. TANZANIA 
                             TEL; +255 763 652 641/+255 718 133 333 
                                     Email; landroverclubtz@gmail.com 
 
 
 
Kumb Na. LRCT/Adm/......................     Tarehe ${currentDate}
 
 
 
 
 
 
 
 
 
A. MAELEZO YA MWOMBAJI NA MDHAMINI 
1. TAARIFA BINAFSI 
1.1 Jina la Mwombaji: ${formData.jinaLaMwombaji}
1.2 Tarehe ya Kuzaliwa: ${formData.tareheyaKuzaliwa} (Ambatisha nakala ya Kitambulisho cha Taifa au Hati ya 
Kusafiria) 
1.3 Jinsia: ${formData.jinsia === "me" ? "Me ✓" : "Me"} ${formData.jinsia === "ke" ? "Ke ✓" : "Ke"}
1.4 Anuani Kamili: S.L.P ${formData.slp}
${formData.anuaniKamili}
Namba ya simu ya mkononi: ${formData.nambaYaSimu} Barua pepe: ${formData.baruaPepe}
 
1.5 Wasifu wa mwombaji kwa ufipi: 
${formData.wasifuWaMwombaji}
 
 
 
 
 
 
 
1.6 Umepataje taarifa za Tanzania Land Rover Club: ${formData.umepatajeTaarifa}
 
1.7 Tamko la Mwombaji kwa Club: 
Mimi ${formData.jinaLaMwombaji} ninaleta maombi ya kujiunga na Tanzania Land Rover Klabu, 
ninaahidi kuwa mwaminifu na kutimiza masharti yote yaliyopo kwenye Katiba, Kanuni na 
Taratibu za Klabu ikiwa maombi yangu yatakubaliwa. Ninakiri kuwa taarifa zote 
nilizoziandika kwenye fomu hii ni za kweli na sahihi. 
 
Sahihi ya mwombaji ...................................  tarehe ${currentDate}
 
BANDIKA 
PICHA 

                                                            
                                                                                                                      
                                      
 
      LAND ROVER CLUB TANZANIA 
 P. O. BOX 77, MOROGORO. TANZANIA 
                             TEL; +255 763 652 641/+255 718 133 333 
                                     Email; landroverclubtz@gmail.com 
 
2. MDHAMINI 
2.1 Jina la Mdhamini: ${formData.jinaLaMdhamini}
2.2 Anuani kamili; S.L.P: ${formData.slpYaMdhamini}
${formData.anuaniYaMdhamini}
Namba ya simu ya Mkononi: ${formData.nambaYaSimuYaMdhamini} Barua pepe: ${formData.baruaPepeYaMdhamini}
2.3 Maelezo ya mdhamini kwa mdhaminiwa: ${formData.malezoYaMdhamini}
2.4 Sahihi ya Mdhamini .................. Tarehe ${currentDate}
 
 
B. MASHARTI YA KUJIUNGA 
 
3. ADA NA MICHANGO 
3.1 Ada na Michango ya lazima 
 
Na. Aina ya Malipo Kiwango Tsh Maelezo 
1 Malipo ya Fomu 50,000/- Inalipwa mara moja wakati wa 
kuchukua fomu 
2 Ada ya Kiingilio kwa 
Mwombaji 
60,000/- Inalipwa mara moja tu (Wakati wa 
kujiunga na Klabu) 
3 Ada ya mwezi  15,000/- Inalipwa kila mwezi (Kati ya Tarehe 1 
hadi 5 ya Mwezi) 
4 Michango mbali 
mabali (Kama Msiba, 
maradhi, Sare, n.k) 
50,000/- Inaweza kulipwa pamoja na ada ya 
Kiingilio kwa mwanaklabu anaejiunga 
ama kati ya mwezi Januari na Juni 
kwa mwanaklabu aliyekwisha jiunga 
 
Muhimu: Mwanaklabu atatakiwa kulipa michango hii ndani ya siku 14 (kumi na nne) 
tangia tarehe ya kukubaliwa kuwa mjumbe wa Klabu. Utaratibu wa malipo ya ada na 
michango utaelekezwa katika barua ya kukubaliwa. 
 
3.2 Michango Mingine 
3.2.1 Barua ya kukubaliwa kujiunga na Klabu, maelezo mengine ya aina ya ada/na 
michango inayohitajika kwa wakati huo yaweza kutolewa au kuelekezwa 
3.2.2 Iwapo mwombaji ataridhia malipo hayo, atawajibika kutoa taarifa ya 
kimaandishi kwa Katibu wa Klabu ya kuwasilisha malipo hayo. 
 

                                                            
                                                                                                                      
                                      
 
      LAND ROVER CLUB TANZANIA 
 P. O. BOX 77, MOROGORO. TANZANIA 
                             TEL; +255 763 652 641/+255 718 133 333 
                                     Email; landroverclubtz@gmail.com 
 
 
C. KWA MATUMIZI YA OFISI TU 
4. UTHIBITISHO WA MAOMBI 
Mara baada ya kuyasoma maombi na kuhojiana na mwombaji pamoja na mdhamini wake, 
uongozi wa Klabu umepitisha/umekataa kupitisha/kukubali maombi ya Bw${formData.jinaLaMwombaji}
katika kikao chake cha tarehe ........................ kujiunga na Tanzania Land Rover Klabu. 
 
Jina na Sahihi ya Katibu: .........................................            Tarehe: ................................. 
 
Jina na Sahihi ya Mwenyekiti: .........................................  Tarehe: .................................. 
 
Muhimu; Maombi haya yatumwe kwa njia ya barua pepe ya Klabu, 
landroverclubtz@gmail.com 
 
 
 
    `

    const blob = new Blob([pdfContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `LRCT-Application-${formData.jinaLaMwombaji || "Form"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
                <span>Kumb Na. LRCT/Adm/........................</span>
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
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    Wasilisha Maombi
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
