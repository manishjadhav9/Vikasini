'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Briefcase, Clock, MapPin, Upload } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function JobApplicationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { language, t } = useLanguage()
  
  // Use React.use() to unwrap the params object properly
  const resolvedParams = React.use(params as any) as { id: string }
  const jobId = resolvedParams.id
  
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    coverLetter: '',
    resumeUrl: null as string | null
  })

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/jobs?id=${jobId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details')
        }
        
        const data = await response.json()
        setJob(data.job)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'An error occurred')
        setLoading(false)
      }
    }
    
    fetchJobDetails()
  }, [jobId])
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle file upload (resumeUrl would normally be handled by a file upload service)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, we would upload the file to a storage service
    // For now, we'll just set a placeholder value
    setFormData(prev => ({
      ...prev,
      resumeUrl: e.target.files?.[0]?.name || null
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setSubmitError(null)
      
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId,
          ...formData
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit application')
      }
      
      // Application submitted successfully
      setSubmitted(true)
      setSubmitting(false)
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/jobs')
      }, 2000)
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred')
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }
  
  if (error || !job) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Job not found'}
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/jobs">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('dashboard.view.opportunities')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }
  
  if (submitted) {
    return (
      <div className="p-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle>{t('jobs.application.success')}</AlertTitle>
          <AlertDescription>
            {t('jobs.application.success')}
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Redirecting to jobs page...
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href={`/dashboard/jobs/${jobId}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('jobs.view.details')}
          </Link>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <CardDescription className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{job.hours}</span>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('jobs.application.title')}</CardTitle>
          <CardDescription>
            {t('jobs.application.subtitle')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {submitError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('jobs.application.form.name')}</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('jobs.application.form.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">{t('jobs.application.form.phone')}</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">{t('jobs.application.form.experience')}</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">{t('jobs.application.form.skills')}</Label>
              <Textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">{t('jobs.application.form.cover')}</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume">{t('jobs.application.form.resume')}</Label>
              <div className="border rounded-md p-2">
                <label htmlFor="resume" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>{formData.resumeUrl || 'Select file'}</span>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? t('loading') : t('jobs.application.form.submit')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 