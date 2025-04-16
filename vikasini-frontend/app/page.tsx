import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Briefcase, Globe, Headphones, MessageSquare, Trophy, Users } from "lucide-react"
import { getUnsplashImage } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-vikasini-black text-white py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-vikasini-orange p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Vikasini</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="text-white border-white hover:bg-vikasini-orange hover:text-white bg-vikasini-black/40">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-vikasini-orange hover:bg-vikasini-orange/90 text-white">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-vikasini-black to-vikasini-black/90 text-white py-20">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Her Growth Journey <span className="text-vikasini-orange">Starts Here</span>
            </h1>
            <p className="text-lg mb-6">
              A multilingual, AI-powered learning and employment platform designed to upskill underprivileged women and
              connect them to remote job opportunities.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <Button className="bg-vikasini-orange hover:bg-vikasini-orange/90 text-white">Get Started</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="text-white border-white hover:bg-vikasini-orange hover:bg-opacity-20 bg-vikasini-black/40">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <img src={getUnsplashImage("women education empowerment", 400, 400)} alt="Women learning" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-vikasini-orange" />}
              title="Multilingual Voice Support"
              description="Voice input/output in regional languages for easy accessibility"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10 text-vikasini-orange" />}
              title="AI-Based Learning Paths"
              description="Personalized content adaptation, motivation, and feedback"
            />
            <FeatureCard
              icon={<Briefcase className="h-10 w-10 text-vikasini-orange" />}
              title="Job & Freelance Matching"
              description="Filter opportunities by skill, language, and accessibility"
            />
            <FeatureCard
              icon={<Trophy className="h-10 w-10 text-vikasini-orange" />}
              title="Gamification"
              description="XP points, badges, and rewards to keep users engaged"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Register & Assess"
              description="Sign up and complete a skill assessment to get your personalized learning path"
            />
            <StepCard
              number="2"
              title="Learn & Practice"
              description="Complete courses with voice-based support in your preferred language"
            />
            <StepCard
              number="3"
              title="Connect & Earn"
              description="Get matched with remote jobs and freelance opportunities"
            />
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-vikasini-black text-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-vikasini-orange" />}
              title="Peer Interaction"
              description="Chatboards with GPT moderation and peer learning circles"
              dark
            />
            <FeatureCard
              icon={<Headphones className="h-10 w-10 text-vikasini-orange" />}
              title="Emotion-Aware AI Mentor"
              description="Detect stress/emotions via voice and provide motivational responses"
              dark
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-vikasini-orange" />}
              title="Local Impact Dashboard"
              description="Track course completions, job matches, and feedback metrics"
              dark
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-vikasini-orange text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Growth Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of women who are transforming their lives through skills and opportunities.
          </p>
          <Link href="/login">
            <Button className="bg-white text-vikasini-orange hover:bg-white/90">Get Started Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vikasini-black text-white py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-vikasini-orange p-1 rounded-full">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-bold">Vikasini</h3>
              </div>
              <p className="text-sm text-gray-300">Her Growth Journey Starts Here</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Courses</li>
                <li>Job Opportunities</li>
                <li>Mentorship</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Blog</li>
                <li>Success Stories</li>
                <li>FAQ</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>info@vikasini.org</li>
                <li>+91 123 456 7890</li>
                <li>Follow us on social media</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>© {new Date().getFullYear()} Vikasini. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  dark?: boolean;
}

function FeatureCard({ icon, title, description, dark = false }: FeatureCardProps) {
  return (
    <div className={`p-6 rounded-lg ${dark ? "bg-vikasini-black/80" : "bg-white shadow-lg"}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`${dark ? "text-gray-300" : "text-gray-600"}`}>{description}</p>
    </div>
  )
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="p-6 rounded-lg bg-white shadow-lg text-center">
      <div className="bg-vikasini-orange text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
