'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getUnsplashImage } from "@/lib/utils"

export default function CreatePostPage() {
  const router = useRouter()
  const { language, t } = useLanguage()
  
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      setSubmitError(null)
      
      // In a real app, the user ID and name would come from authentication
      const authorId = '4' // Assuming this is Priyanka's ID
      const authorName = 'Priyanka M.'
      const authorAvatar = getUnsplashImage("woman professional indian", 40, 40)
      
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          authorId,
          authorName,
          authorAvatar
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }
      
      // Post created successfully
      setSubmitted(true)
      setSubmitting(false)
      
      // Redirect to community page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/community')
      }, 2000)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'An unknown error occurred')
      setSubmitting(false)
    }
  }
  
  if (submitted) {
    return (
      <div className="p-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your post has been created successfully!
          </AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Redirecting to community page...
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/community">
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('dashboard.community.title')}
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('community.create.post')}</CardTitle>
          <CardDescription>
            Share your thoughts with the Vikasini community
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
              <Label htmlFor="title">{t('community.post.title')}</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">{t('community.post.content')}</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? t('loading') : t('community.submit.post')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 