'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog"

export default function RegistrationForm() {
  const [areasOfExpertise, setAreasOfExpertise] = useState("")

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Become an Expert</h1>
          <p className="mt-2 text-sm text-gray-500">Help shape the next generation by sharing your expertise</p>
          <p className="mt-4 text-sm text-gray-600">Signed in as <span className="font-medium">rko812551@gmail.com</span></p>
        </div>

        <div className="mt-12 border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900">Expert Application Form</h2>
          <p className="mt-1 text-sm text-gray-600">Tell us about your professional background and expertise</p>

          <form className="mt-8 space-y-8">
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="profile-picture">Profile Picture *</Label>
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <Button variant="link" size="sm">Upload Picture</Button>
              <Input id="profile-picture" type="file" className="hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name *</Label>
                <Input id="full-name" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="flex items-center gap-2">
                  <Input id="email" type="email" placeholder="you@example.com" />
                  <Button variant="outline">Verify</Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number *</Label>
              <Input id="phone-number" placeholder="+91-XXXXXXXXXX" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume *</Label>
              <Input id="resume" type="file" />
              <p className="text-xs text-gray-500">Upload your resume in PDF, DOC, or DOCX format (max 10MB)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select defaultValue="india">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add states here */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add cities here */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="job-title">Current Job Title *</Label>
                <Input id="job-title" placeholder="e.g., Senior Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Current Company/Organization *</Label>
                <Input id="company" placeholder="Your Company Name" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Primary Industry *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry..." />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Add industries here */}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Professional Experience *</Label>
                <Input id="experience" placeholder="e.g., 5" />
                <p className="text-xs text-gray-500">Minimum 2 years of experience required to be a mentor.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Areas of Expertise *</Label>
              <Textarea
                id="expertise"
                placeholder="List skills you can mentor in (e.g., Python, Digital Marketing, Leadership, Career Transitions). Minimum 100 characters, maximum 500 characters."
                value={areasOfExpertise}
                onChange={(e) => setAreasOfExpertise(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <p>Minimum 100 characters. Be specific! This helps mentees find you. Use commas to separate multiple areas.</p>
                <span>{areasOfExpertise.length}/500</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Preferred Mentorship Availability *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {/* Add availability options here */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL *</Label>
              <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Dialog>
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the <DialogTrigger asChild><a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a></DialogTrigger> (placeholder)
                </Label>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Terms and Conditions</DialogTitle>
                    <DialogDescription>
                      This is a placeholder for the terms and conditions. Replace this with your actual terms and conditions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="prose">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                  <DialogFooter>
                    <Button>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center">
                <Button type="submit" size="lg">Submit Application</Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
