"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface FormData {
  // Personal Information
  jina: string
  tareheyaKuzaliwa: string
  jinsia: string
  nambaYaSimu: string
  baruaPepe: string
  unapoishi: string
  sandukulaPosta: string
  gariModel: string
  gariType: string
  
  // Emergency Contact
  jinaLaMtuWaDharura: string
  uhusiano: string
  nambaYaSimuYaMtuWaDharura: string
  
  // Profile
  wasifu: string
  
  // Guarantor
  jinaLaMdhamini: string
  
  // Signatures
  sainiYaMwombaji: string
  tarehe: string
}

interface SimpleMembershipFormProps {
  onBack?: () => void
}

const SimpleMembershipForm = ({ onBack }: SimpleMembershipFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    jina: "",
    tareheyaKuzaliwa: "",
    jinsia: "",
    nambaYaSimu: "",
    baruaPepe: "",
    unapoishi: "",
    sandukulaPosta: "",
    gariModel: "",
    gariType: "",
    jinaLaMtuWaDharura: "",
    uhusiano: "",
    nambaYaSimuYaMtuWaDharura: "",
    wasifu: "",
    jinaLaMdhamini: "",
    sainiYaMwombaji: "",
    tarehe: new Date().toLocaleDateString("sw-TZ")
  })

  const exportToPDF = async () => {
    const element = document.getElementById('membership-form');
    const buttonsContainer = document.querySelector('.form-actions');
    const uploadInputs = document.querySelectorAll('input[type="file"]');
    
    if (!element) return;

    try {
      // Hide buttons and file inputs during PDF generation
      if (buttonsContainer) {
        (buttonsContainer as HTMLElement).style.display = 'none';
      }
      uploadInputs.forEach(input => {
        (input as HTMLElement).style.display = 'none';
      });
      
      // Add PDF-specific styling
      element.classList.add('pdf-export');
      
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`LRCT-Membership-Form-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Restore visibility
      if (buttonsContainer) {
        (buttonsContainer as HTMLElement).style.display = 'flex';
      }
      uploadInputs.forEach(input => {
        (input as HTMLElement).style.display = 'block';
      });
      
      // Remove PDF-specific styling
      element.classList.remove('pdf-export');
    }
  };

  const landRoverModels = ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Range Rover Velar', 'Freelander'];
  
  const landRoverTypes = {
    'Defender': ['90', '110', '130', 'Hard Top', 'Station Wagon'],
    'Discovery': ['Discovery 1', 'Discovery 2', 'Discovery 3', 'Discovery 4', 'Discovery 5'],
    'Discovery Sport': ['SE', 'HSE', 'HSE Luxury', 'R-Dynamic'],
    'Range Rover': ['Vogue', 'Autobiography', 'SVAutobiography', 'P400e Hybrid'],
    'Range Rover Sport': ['SE', 'HSE', 'Autobiography', 'SVR'],
    'Range Rover Evoque': ['S', 'SE', 'HSE', 'R-Dynamic'],
    'Range Rover Velar': ['S', 'SE', 'HSE', 'R-Dynamic'],
    'Freelander': ['Freelander 1', 'Freelander 2', 'TD4', 'V6']
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'gariModel') {
      setFormData(prev => ({ ...prev, [field]: value, gariType: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card id="membership-form" className="shadow-lg border-2 border-gray-800">
        <CardHeader className="text-center border-b-2 border-black pb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
                <img 
                  src="/images/club_logo.svg" 
                  alt="Land Rover Club Tanzania Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-center text-black mb-2">Land Rover Club Tanzania</h1>
              <h2 className="text-xl font-bold text-center text-black">Fomu ya Maombi ya Uanachama</h2>
            </div>
            <div className="w-28 h-36 border-2 border-black flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const img = e.target.parentElement?.querySelector('img');
                      if (img && event.target?.result) {
                        img.src = event.target.result as string;
                        img.style.display = 'block';
                      }
                      const span = e.target.parentElement?.querySelector('span');
                      if (span) span.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <img className="w-full h-full object-cover hidden" alt="Uploaded photo" />
              <span className="text-black font-bold text-sm pointer-events-none">PICHA</span>
              <span className="text-xs text-gray-600 mt-1 pointer-events-none text-center">Click to upload</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Taarifa Binafsi */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-black border-b-2 border-black pb-2">1. Taarifa Binafsi</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="w-20 text-base font-bold text-black">Jina:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.jina}
                      onChange={(e) => handleInputChange("jina", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="text-base font-bold text-black">ME</Label>
                    <Checkbox 
                      checked={formData.jinsia === "ME"}
                      onCheckedChange={(checked) => handleInputChange("jinsia", checked ? "ME" : "")}
                      className="border-2 border-black"
                    />
                    <Label className="text-base font-bold text-black">KE</Label>
                    <Checkbox 
                      checked={formData.jinsia === "KE"}
                      onCheckedChange={(checked) => handleInputChange("jinsia", checked ? "KE" : "")}
                      className="border-2 border-black"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Label className="w-32 text-base font-bold text-black">Tarehe ya kuzaliwa:</Label>
                    <div className="flex-1 border-b-2 border-black">
                      <Input 
                        type="date"
                        value={formData.tareheyaKuzaliwa}
                        onChange={(e) => handleInputChange("tareheyaKuzaliwa", e.target.value)}
                        className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      />
                    </div>
                  </div>
                
                <div className="flex items-center gap-4">
                  <Label className="w-32 text-base font-bold text-black">Namba ya simu:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.nambaYaSimu}
                      onChange={(e) => handleInputChange("nambaYaSimu", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                  <Label className="w-20 text-base font-bold text-black">Barua Pepe:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      type="email"
                      value={formData.baruaPepe}
                      onChange={(e) => handleInputChange("baruaPepe", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label className="w-20 text-base font-bold text-black">Unapoishi:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.unapoishi}
                      onChange={(e) => handleInputChange("unapoishi", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label className="w-32 text-base font-bold text-black">Sanduku la Posta:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.sandukulaPosta}
                      onChange={(e) => handleInputChange("sandukulaPosta", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base font-bold text-black">Gari unayomiliki (Land Rover Model na Type):</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-black">Model ya Land Rover</Label>
                      <Select value={formData.gariModel} onValueChange={(value) => handleInputChange('gariModel', value)}>
                        <SelectTrigger className="border-0 border-b-2 border-black rounded-none bg-transparent text-base focus:border-black focus:ring-0">
                          <SelectValue placeholder="Chagua model ya Land Rover" />
                        </SelectTrigger>
                        <SelectContent>
                          {landRoverModels.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-black">Type/Variant</Label>
                      <Select 
                        value={formData.gariType} 
                        onValueChange={(value) => handleInputChange('gariType', value)}
                        disabled={!formData.gariModel}
                      >
                        <SelectTrigger className="border-0 border-b-2 border-black rounded-none bg-transparent text-base focus:border-black focus:ring-0">
                          <SelectValue placeholder={formData.gariModel ? "Chagua type" : "Chagua model kwanza"} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.gariModel && landRoverTypes[formData.gariModel as keyof typeof landRoverTypes]?.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 2. Mtu wa Dharura */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-black border-b-2 border-black pb-2">2. Mtu wa Dharura</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label className="w-20 text-base font-bold text-black">Jina:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.jinaLaMtuWaDharura}
                      onChange={(e) => handleInputChange("jinaLaMtuWaDharura", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label className="w-20 text-base font-bold text-black">Uhusiano:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.uhusiano}
                      onChange={(e) => handleInputChange("uhusiano", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label className="w-32 text-base font-bold text-black">Namba ya Simu:</Label>
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.nambaYaSimuYaMtuWaDharura}
                      onChange={(e) => handleInputChange("nambaYaSimuYaMtuWaDharura", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 3. Wasifu */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-black border-b-2 border-black pb-2">3. Wasifu</h3>
              <p className="text-base mb-4 font-medium text-black">
                Jitambulishe kuwa ufupi kuhusu shughuli zako, interests, hobbies, na nini unategemea 
                kukipata baada ya kujiunga Klabu:
              </p>
              <Textarea 
                value={formData.wasifu}
                onChange={(e) => handleInputChange("wasifu", e.target.value)}
                className="min-h-[120px] border-2 border-black rounded-none text-base bg-transparent"
                placeholder="Andika hapa..."
              />
            </div>
            
            {/* 4. Mdhamini */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-black border-b-2 border-black pb-2">4. Mdhamini</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <span className="text-base font-medium text-black">Jina la mdhamini wako na namba ya simu (mdhamini lazima awe mwanachama wa Klabu):</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-b-2 border-black">
                    <Input 
                      value={formData.jinaLaMdhamini}
                      onChange={(e) => handleInputChange("jinaLaMdhamini", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base"
                      placeholder="_________________________"
                    />
                  </div>
                </div>
                
                <div className="flex gap-8 mt-8">
                  <div className="flex-1">
                    <Label className="text-base font-bold text-black">Saini ya Mwombaji</Label>
                    <div className="border-b-2 border-black mt-3 h-16"></div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-base font-bold text-black">Tarehe</Label>
                    <Input 
                      type="date"
                      value={formData.tarehe}
                      onChange={(e) => handleInputChange("tarehe", e.target.value)}
                      className="border-0 border-b-2 border-black rounded-none px-0 focus:ring-0 bg-transparent text-base mt-3"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* MUHIMU Section */}
            <div className="mt-8 border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-6 text-black">MUHIMU;</h3>
              <ul className="space-y-3 text-base font-medium">
                <li className="flex items-center"><span className="mr-2">•</span>Ada ya Fomu ni Tsh 50,000/=</li>
                <li className="flex items-center"><span className="mr-2">•</span>Kiingilio katika Klabu ni Tsh 60,000/=</li>
                <li className="flex items-center"><span className="mr-2">•</span>Ada kwa mwezi ni Tsh 15,000/=</li>
                <li className="flex items-center"><span className="mr-2">•</span>Mchango wa matukio wa mwaka Tsh 50,000/=</li>
              </ul>
              
              <div className="mt-6 space-y-3 text-sm font-medium">
                <p className="text-black">Ambatisha nakala ya Kitambulisho (NIDA/Hati ya Kusafiria/Leseni ya Udereva)</p>
                <p className="text-black">
                  Mawasiliano; Simu +255 731 652 652 au +255 763 652 641; info@landroverclub.or.tz
                </p>
              </div>
            </div>
            
            {/* Document Upload Section */}
            <div className="mt-8 pt-6 border-t-2 border-black">
              <h3 className="text-xl font-bold text-black mb-6 pb-2 border-b-2 border-black">NYARAKA ZA UTAMBULISHO</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Driver's License Upload */}
                <div className="space-y-2">
                  <Label className="text-lg font-bold text-black">Leseni ya Udereva</Label>
                  <div className="w-full h-48 border-2 border-black flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                           reader.onload = (event) => {
                             const img = e.target.parentElement?.querySelector('img') as HTMLImageElement;
                             const span = e.target.parentElement?.querySelector('.upload-text') as HTMLElement;
                             const fileName = e.target.parentElement?.querySelector('.file-name') as HTMLElement;
                             if (file.type.includes('image') && img && event.target?.result) {
                               img.src = event.target.result as string;
                               img.style.display = 'block';
                               if (span) span.style.display = 'none';
                             } else {
                               if (fileName) {
                                 fileName.textContent = file.name;
                                 fileName.style.display = 'block';
                               }
                               if (span) span.style.display = 'none';
                             }
                           };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <img className="w-full h-full object-cover hidden" alt="Driver's License" />
                    <div className="upload-text text-center pointer-events-none">
                      <span className="text-black font-bold text-lg">LESENI YA UDEREVA</span>
                      <span className="text-sm text-gray-600 mt-2 block">Bofya kupakia picha au PDF</span>
                    </div>
                    <span className="file-name text-sm text-green-600 mt-2 hidden text-center"></span>
                  </div>
                </div>

                {/* National ID Upload */}
                <div className="space-y-2">
                  <Label className="text-lg font-bold text-black">Kitambulisho cha Taifa</Label>
                  <div className="w-full h-48 border-2 border-black flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                           reader.onload = (event) => {
                             const img = e.target.parentElement?.querySelector('img') as HTMLImageElement;
                             const span = e.target.parentElement?.querySelector('.upload-text') as HTMLElement;
                             const fileName = e.target.parentElement?.querySelector('.file-name') as HTMLElement;
                             if (file.type.includes('image') && img && event.target?.result) {
                               img.src = event.target.result as string;
                               img.style.display = 'block';
                               if (span) span.style.display = 'none';
                             } else {
                               if (fileName) {
                                 fileName.textContent = file.name;
                                 fileName.style.display = 'block';
                               }
                               if (span) span.style.display = 'none';
                             }
                           };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <img className="w-full h-full object-cover hidden" alt="National ID" />
                    <div className="upload-text text-center pointer-events-none">
                      <span className="text-black font-bold text-lg">KITAMBULISHO CHA TAIFA</span>
                      <span className="text-sm text-gray-600 mt-2 block">Bofya kupakia picha au PDF</span>
                    </div>
                    <span className="file-name text-sm text-green-600 mt-2 hidden text-center"></span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="form-actions flex flex-col sm:flex-row gap-4 justify-center mt-8">
              {onBack && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  className="px-8 py-2"
                >
                  Rudi Kwenye Mipango
                </Button>
              )}
              <Button 
                type="button" 
                onClick={exportToPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
              >
                Pakua PDF
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-8 py-2">
                Wasilisha Maombi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SimpleMembershipForm