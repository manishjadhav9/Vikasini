// Translations for UI elements across the application

export type Language = 'english' | 'hindi' | 'marathi' | 'tamil' | 'telugu';

export type TranslationKey =
  | 'welcome'
  | 'loading'
  | 'name'
  | 'submit'
  | 'mentor.title'
  | 'mentor.subtitle'
  | 'mentor.description'
  | 'mentor.features.title'
  | 'mentor.features.description'
  | 'mentor.voice.title'
  | 'mentor.voice.description'
  | 'mentor.learning.title'
  | 'mentor.learning.description'
  | 'mentor.career.title'
  | 'mentor.career.description'
  | 'mentor.emotional.title'
  | 'mentor.emotional.description'
  | 'mentor.suggested.title'
  | 'mentor.suggested.description'
  | 'mentor.typing.question'
  | 'mentor.interview.question'
  | 'mentor.excel.question'
  | 'mentor.email.question'
  | 'mentor.welcome'
  | 'mentor.thinking'
  | 'mentor.loading'
  | 'mentor.placeholder'
  | 'mentor.typing.response'
  | 'mentor.interview.response'
  | 'mentor.excel.response'
  | 'mentor.email.response'
  | 'mentor.default.response'
  | 'language.label'
  | 'language.select'
  | 'dashboard.title'
  | 'dashboard.subtitle'
  | 'dashboard.learning.path'
  | 'dashboard.learning.progress'
  | 'dashboard.progress.week'
  | 'dashboard.courses.completed'
  | 'dashboard.courses.inprogress'
  | 'dashboard.xp.points'
  | 'dashboard.xp.next'
  | 'dashboard.continue.learning'
  | 'dashboard.view.all'
  | 'dashboard.analytics.title'
  | 'dashboard.analytics.description'
  | 'dashboard.skills.title'
  | 'dashboard.skills.description'
  | 'dashboard.jobs.title'
  | 'dashboard.jobs.description'
  | 'dashboard.view.opportunities'
  | 'dashboard.community.title'
  | 'dashboard.community.description'
  | 'dashboard.join.community'
  | 'dashboard.tabs.activity'
  | 'dashboard.tabs.peers'
  | 'dashboard.recommended.courses'
  | 'dashboard.job.opportunities'
  | 'courses.digital'
  | 'courses.data'
  | 'courses.communication'
  | 'courses.status.inprogress'
  | 'courses.status.notstarted'
  | 'courses.time.remaining'
  | 'courses.time.total'
  | 'jobs.dataentry'
  | 'jobs.customer'
  | 'jobs.virtual'
  | 'jobs.match'
  | 'jobs.apply'
  | 'companies.techsolutions'
  | 'companies.globalservices'
  | 'companies.supporthub'
  | 'community.tabs.discussions'
  | 'community.tabs.peers'
  | 'community.post1'
  | 'community.post2'
  | 'community.post3'
  | 'community.post4'
  | 'users.meera'
  | 'users.anjali'
  | 'users.lakshmi'
  | 'users.priyanka'
  | 'time.hours'
  | 'time.days'
  | 'days.mon'
  | 'days.tue'
  | 'days.wed'
  | 'days.thu'
  | 'days.fri'
  | 'days.sat'
  | 'days.sun'
  | 'skills.digital'
  | 'skills.communication'
  | 'skills.data'
  | 'skills.customer'
  | 'skills.content'
  | 'skills.typing'
  | 'skills.excel'
  | 'skills.organization'
  // Achievement related translations
  | 'achievements.title'
  | 'achievements.view.all'
  | 'achievements.fast.learner.title'
  | 'achievements.fast.learner.desc'
  | 'achievements.consistent.title'
  | 'achievements.consistent.desc'
  | 'achievements.quiz.title'
  | 'achievements.quiz.desc'
  | 'achievements.course.title'
  | 'achievements.course.desc'
  | 'achievements.earned'
  // Community related translations
  | 'community.join.conversation'
  | 'community.replies'
  | 'community.create.post'
  | 'community.post.title'
  | 'community.post.content'
  | 'community.submit.post'
  // Job application related
  | 'jobs.apply.now'
  | 'jobs.view.details'
  | 'jobs.application.title'
  | 'jobs.application.subtitle'
  | 'jobs.application.form.name'
  | 'jobs.application.form.email'
  | 'jobs.application.form.phone'
  | 'jobs.application.form.experience'
  | 'jobs.application.form.skills'
  | 'jobs.application.form.cover'
  | 'jobs.application.form.resume'
  | 'jobs.application.form.submit'
  | 'jobs.application.success'
  | 'jobs.application.error'
  | 'jobs.types.remote'
  | 'jobs.types.hybrid'
  | 'jobs.types.onsite';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  english: {
    'welcome': 'Welcome back, Priya!',
    'loading': 'Loading...',
    'name': 'Name',
    'submit': 'Submit',
    'mentor.title': 'AI Mentor',
    'mentor.subtitle': 'Your personalized AI mentor to guide your learning journey and provide emotional support',
    'mentor.description': 'Always here to help',
    'mentor.features.title': 'Mentor Features',
    'mentor.features.description': 'How your AI mentor can help you',
    'mentor.voice.title': 'Voice Support',
    'mentor.voice.description': 'Speak in your preferred language for assistance',
    'mentor.learning.title': 'Learning Guidance',
    'mentor.learning.description': 'Get help with course content and assignments',
    'mentor.career.title': 'Career Advice',
    'mentor.career.description': 'Guidance on job applications and interviews',
    'mentor.emotional.title': 'Emotional Support',
    'mentor.emotional.description': 'Motivation and encouragement when you need it',
    'mentor.suggested.title': 'Suggested Topics',
    'mentor.suggested.description': 'Questions you might want to ask',
    'mentor.typing.question': 'How can I improve my typing speed for data entry?',
    'mentor.interview.question': 'I\'m nervous about my upcoming job interview. Any tips?',
    'mentor.excel.question': 'Can you explain Excel VLOOKUP function in simple terms?',
    'mentor.email.question': 'How do I create a professional email for job applications?',
    'mentor.welcome': 'Hello! I\'m your Vikasini AI mentor. How can I help you with your learning journey today?',
    'mentor.thinking': 'Thinking...',
    'mentor.loading': 'Loading AI Mentor...',
    'mentor.placeholder': 'Type your message...',
    'mentor.typing.response': 'To improve your typing speed for data entry, try daily practice with typing games or software like TypingClub. Start with accuracy before speed, use all fingers properly, and gradually increase your practice time. Consider taking breaks and setting small, achievable goals to track your progress.',
    'mentor.interview.response': 'It\'s completely normal to feel nervous about job interviews. Prepare by researching the company, practicing answers to common questions, and preparing examples of your skills. On interview day, arrive early, dress professionally, and remember to breathe deeply. Your Vikasini courses have prepared you well!',
    'mentor.excel.response': 'VLOOKUP is like a detective that finds information for you in a table. It works by saying: \'Find this value in the leftmost column, then give me what\'s in the same row but in another column.\' The format is =VLOOKUP(what you\'re looking for, where to look, which column has your answer, exact/approximate match).',
    'mentor.email.response': 'For a professional job application email, use a clear subject line with the job title, start with a formal greeting, briefly introduce yourself, mention where you found the job, highlight 2-3 relevant skills, refer to your attached resume, and end with a polite closing. Keep it concise and proofread carefully before sending.',
    'mentor.default.response': 'I understand you\'re looking for guidance on this topic. Based on your progress in the Digital Literacy and Data Entry courses, I\'d suggest breaking this down into smaller steps. What specific part are you finding challenging? I\'m here to help you work through it step-by-step.',
    
    // Dashboard translations
    'language.label': 'Language:',
    'language.select': 'Select language',
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Track your learning progress and opportunities',
    'dashboard.learning.path': 'AI Powered Personalized Path',
    'dashboard.learning.progress': 'Learning Progress',
    'dashboard.progress.week': '+12% from last week',
    'dashboard.courses.completed': 'Courses Completed',
    'dashboard.courses.inprogress': '2 courses in progress',
    'dashboard.xp.points': 'XP Points',
    'dashboard.xp.next': '250 points to next level',
    'dashboard.continue.learning': 'Continue Learning',
    'dashboard.view.all': 'View all courses',
    'dashboard.analytics.title': 'Your Learning Analytics',
    'dashboard.analytics.description': 'Track your progress over the past week',
    'dashboard.skills.title': 'Skill Progress',
    'dashboard.skills.description': 'Your current skill levels',
    'dashboard.jobs.title': 'Recommended Job Opportunities',
    'dashboard.jobs.description': 'Based on your skills and progress',
    'dashboard.view.opportunities': 'View All Opportunities',
    'dashboard.community.title': 'Community Activity',
    'dashboard.community.description': 'Recent discussions and peer learning',
    'dashboard.join.community': 'Join Community',
    'dashboard.tabs.activity': 'Recent Activity',
    'dashboard.tabs.peers': 'Peers Near You',
    'dashboard.recommended.courses': 'Recommended Courses',
    'dashboard.job.opportunities': 'Job Opportunities',
    
    // Course related translations
    'courses.digital': 'Digital Literacy Fundamentals',
    'courses.data': 'Basic Data Entry Skills',
    'courses.communication': 'Communication Skills',
    'courses.status.inprogress': 'In Progress',
    'courses.status.notstarted': 'Not Started',
    'courses.time.remaining': '{time} remaining',
    'courses.time.total': '{time} total',
    
    // Job related translations
    'jobs.dataentry': 'Data Entry Specialist',
    'jobs.customer': 'Customer Support Associate',
    'jobs.virtual': 'Virtual Assistant',
    'jobs.match': '{percent}% Match',
    'jobs.apply': 'Apply Now',
    
    // Company names
    'companies.techsolutions': 'TechSolutions Inc.',
    'companies.globalservices': 'GlobalServices Ltd.',
    'companies.supporthub': 'SupportHub',
    
    // Community related translations
    'community.tabs.discussions': 'Discussions',
    'community.tabs.peers': 'Peer Learning',
    'community.post1': 'Has anyone completed the data entry certification? I\'m looking for study tips!',
    'community.post2': 'Just got my first freelance job through the platform! So excited!',
    'community.post3': 'I\'m organizing a study group for the digital literacy course. Anyone interested?',
    'community.post4': 'Sharing my notes from the communication skills module. Hope it helps!',
    
    // User names
    'users.meera': 'Meera K.',
    'users.anjali': 'Anjali T.',
    'users.lakshmi': 'Lakshmi R.',
    'users.priyanka': 'Priyanka M.',
    
    // Time indicators
    'time.hours': '{hours} hours ago',
    'time.days': '{days} day ago',
    
    // Days of week
    'days.mon': 'Mon',
    'days.tue': 'Tue',
    'days.wed': 'Wed',
    'days.thu': 'Thu',
    'days.fri': 'Fri',
    'days.sat': 'Sat',
    'days.sun': 'Sun',
    
    // Skills
    'skills.digital': 'Digital Literacy',
    'skills.communication': 'Communication',
    'skills.data': 'Data Entry',
    'skills.customer': 'Customer Service',
    'skills.content': 'Content Writing',
    'skills.typing': 'Typing',
    'skills.excel': 'Excel',
    'skills.organization': 'Organization',
    
    // Achievement related translations
    'achievements.title': 'Recent Achievements',
    'achievements.view.all': 'View all achievements',
    'achievements.fast.learner.title': 'Fast Learner',
    'achievements.fast.learner.desc': 'Complete 5 lessons in a day',
    'achievements.consistent.title': 'Consistent Effort',
    'achievements.consistent.desc': 'Login for 7 consecutive days',
    'achievements.quiz.title': 'Quiz Master',
    'achievements.quiz.desc': 'Score 100% in 3 quizzes',
    'achievements.course.title': 'Course Champion',
    'achievements.course.desc': 'Complete your first course',
    'achievements.earned': 'Earned',
    
    // Community related translations
    'community.join.conversation': 'Join conversation',
    'community.replies': '{replies} replies',
    'community.create.post': 'Create Post',
    'community.post.title': 'Post Title',
    'community.post.content': 'Share your thoughts...',
    'community.submit.post': 'Submit Post',
    
    // Job application related
    'jobs.apply.now': 'Apply Now',
    'jobs.view.details': 'View Details',
    'jobs.application.title': 'Job Application',
    'jobs.application.subtitle': 'Please fill out the form below to apply',
    'jobs.application.form.name': 'Full Name',
    'jobs.application.form.email': 'Email Address',
    'jobs.application.form.phone': 'Phone Number',
    'jobs.application.form.experience': 'Work Experience',
    'jobs.application.form.skills': 'Relevant Skills',
    'jobs.application.form.cover': 'Cover Letter',
    'jobs.application.form.resume': 'Upload Resume',
    'jobs.application.form.submit': 'Submit Application',
    'jobs.application.success': 'Your application has been submitted successfully!',
    'jobs.application.error': 'There was an error submitting your application. Please try again.',
    'jobs.types.remote': 'Remote',
    'jobs.types.hybrid': 'Hybrid',
    'jobs.types.onsite': 'Onsite'
  },
  hindi: {
    'welcome': 'फिर से स्वागत है, प्रिया!',
    'loading': 'लोडिंग...',
    'name': 'नाम',
    'submit': 'सबमिट करें',
    'mentor.title': 'AI मेंटर',
    'mentor.subtitle': 'आपकी सीखने की यात्रा का मार्गदर्शन करने और भावनात्मक सहायता प्रदान करने के लिए आपका व्यक्तिगत AI मेंटर',
    'mentor.description': '',
    'mentor.features.title': 'मेंटर विशेषताएँ',
    'mentor.features.description': 'आपका AI मेंटर आपकी कैसे मदद कर सकता है',
    'mentor.voice.title': 'आवाज़ सहायता',
    'mentor.voice.description': 'सहायता के लिए अपनी पसंदीदा भाषा में बोलें',
    'mentor.learning.title': 'सीखने का मार्गदर्शन',
    'mentor.learning.description': 'पाठ्यक्रम सामग्री और असाइनमेंट के साथ मदद प्राप्त करें',
    'mentor.career.title': 'करियर सलाह',
    'mentor.career.description': 'Guidance on job applications and interviews',
    'mentor.emotional.title': 'भावनात्मक सहायता',
    'mentor.emotional.description': 'जब आपको इसकी आवश्यकता हो, प्रेरणा और प्रोत्साहन',
    'mentor.suggested.title': 'सुझाए गए विषय',
    'mentor.suggested.description': 'आप जो प्रश्न पूछना चाहते हैं',
    'mentor.typing.question': 'मैं डेटा एंट्री के लिए अपनी टाइपिंग गति कैसे सुधार सकता हूँ?',
    'mentor.interview.question': 'मैं माझ्या आगामी जॉब इंटरव्यूबद्दल नर्व्हस आहे. काही टिप्स?',
    'mentor.excel.question': 'क्या आप Excel VLOOKUP फंक्शन को सरल शब्दों में समझा सकते हैं?',
    'mentor.email.question': 'मैं नौकरी आवेदनों के लिए एक पेशेवर ईमेल कैसे बनाऊं?',
    'mentor.welcome': '',
    'mentor.thinking': 'सोच रहा हूँ...',
    'mentor.loading': 'AI मेंटर लोड हो रहा है...',
    'mentor.placeholder': 'अपना संदेश टाइप करें...',
    'mentor.typing.response': '',
    'mentor.interview.response': '',
    'mentor.excel.response': '',
    'mentor.email.response': '',
    'mentor.default.response': '',
    
    // Dashboard translations
    'language.label': 'भाषा:',
    'language.select': 'भाषा चुनें',
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.subtitle': 'अपनी सीखने की प्रगति और अवसरों को ट्रैक करें',
    'dashboard.learning.path': 'AI Powered Personalized Path',
    'dashboard.learning.progress': 'सीखने की प्रगति',
    'dashboard.progress.week': 'पिछले सप्ताह से +12%',
    'dashboard.courses.completed': 'पूरे किए गए कोर्स',
    'dashboard.courses.inprogress': '2 कोर्स प्रगति पर',
    'dashboard.xp.points': 'XP अंक',
    'dashboard.xp.next': 'अगले स्तर तक 250 अंक',
    'dashboard.continue.learning': 'सीखना जारी रखें',
    'dashboard.view.all': 'सभी कोर्स देखें',
    'dashboard.analytics.title': 'आपकी लर्निंग एनालिटिक्स',
    'dashboard.analytics.description': 'पिछले सप्ताह की अपनी प्रगति को ट्रैक करें',
    'dashboard.skills.title': 'कौशल प्रगति',
    'dashboard.skills.description': 'आपके वर्तमान कौशल स्तर',
    'dashboard.jobs.title': 'अनुशंसित नौकरी के अवसर',
    'dashboard.jobs.description': 'आपके कौशल और प्रगति के आधार पर',
    'dashboard.view.opportunities': 'सभी अवसर देखें',
    'dashboard.community.title': 'सामुदायिक गतिविधि',
    'dashboard.community.description': 'हाल की चर्चाएँ और सहकर्मी सीखना',
    'dashboard.join.community': 'समुदाय से जुड़ें',
    'dashboard.tabs.activity': 'हाल की गतिविधि',
    'dashboard.tabs.peers': 'आपके पास के साथी',
    'dashboard.recommended.courses': 'अनुशंसित कोर्स',
    'dashboard.job.opportunities': 'नौकरी के अवसर',
    
    // Course related translations
    'courses.digital': 'डिजिटल साक्षरता की मूल बातें',
    'courses.data': 'बुनियादी डेटा एंट्री कौशल',
    'courses.communication': 'संचार कौशल',
    'courses.status.inprogress': 'प्रगति पर',
    'courses.status.notstarted': 'शुरू नहीं किया',
    'courses.time.remaining': '{time} शेष',
    'courses.time.total': 'कुल {time}',
    
    // Job related translations
    'jobs.dataentry': 'डेटा एंट्री विशेषज्ञ',
    'jobs.customer': 'ग्राहक सहायता सहयोगी',
    'jobs.virtual': 'वर्चुअल असिस्टेंट',
    'jobs.match': '{percent}% मिलान',
    'jobs.apply': 'अभी आवेदन करें',
    
    // Company names
    'companies.techsolutions': 'टेकसॉल्यूशंस इंक.',
    'companies.globalservices': 'ग्लोबलसर्विसेज लिमिटेड',
    'companies.supporthub': 'सपोर्टहब',
    
    // Community related translations
    'community.tabs.discussions': 'चर्चाएँ',
    'community.tabs.peers': 'सहकर्मी सीखना',
    'community.post1': 'क्या किसी ने डेटा एंट्री सर्टिफिकेशन पूरा किया है? मैं अध्ययन युक्तियाँ ढूँढ रहा हूँ!',
    'community.post2': 'प्लेटफॉर्म के माध्यम से मुझे अपना पहला फ्रीलांस काम मिला! बहुत उत्साहित हूँ!',
    'community.post3': 'मैं डिजिटल साक्षरता कोर्स के लिए एक अध्ययन समूह आयोजित कर रहा हूँ। कोई रुचि रखता है?',
    'community.post4': 'संचार कौशल मॉड्यूल से अपने नोट्स साझा कर रहा हूँ। उम्मीद है कि यह मदद करेगा!',
    
    // User names
    'users.meera': 'मीरा के.',
    'users.anjali': 'अंजली टी.',
    'users.lakshmi': 'लक्ष्मी आर.',
    'users.priyanka': 'प्रियंका एम.',
    
    // Time indicators
    'time.hours': '{hours} घंटे पहले',
    'time.days': '{days} दिन पहले',
    
    // Days of week
    'days.mon': 'सोम',
    'days.tue': 'मंगल',
    'days.wed': 'बुध',
    'days.thu': 'गुरु',
    'days.fri': 'शुक्र',
    'days.sat': 'शनि',
    'days.sun': 'रवि',
    
    // Skills
    'skills.digital': 'डिजिटल साक्षरता',
    'skills.communication': 'संचार',
    'skills.data': 'डेटा एंट्री',
    'skills.customer': 'ग्राहक सेवा',
    'skills.content': 'कंटेंट राइटिंग',
    'skills.typing': 'टाइपिंग',
    'skills.excel': 'एक्सेल',
    'skills.organization': 'संगठन',
    
    // Achievement related translations
    'achievements.title': 'हालिया उपलब्धियां',
    'achievements.view.all': 'सभी उपलब्धियां देखें',
    'achievements.fast.learner.title': 'तेज़ सीखने वाला',
    'achievements.fast.learner.desc': 'एक दिन में 5 पाठ पूरा करें',
    'achievements.consistent.title': 'निरंतर प्रयास',
    'achievements.consistent.desc': 'लगातार 7 दिनों तक लॉगिन करें',
    'achievements.quiz.title': 'क्विज़ मास्टर',
    'achievements.quiz.desc': '3 क्विज़ में 100% स्कोर करें',
    'achievements.course.title': 'कोर्स चैंपियन',
    'achievements.course.desc': 'अपना पहला कोर्स पूरा करें',
    'achievements.earned': 'अर्जित',
    
    // Community related translations
    'community.join.conversation': 'बातचीत में शामिल हों',
    'community.replies': '{replies} जवाब',
    'community.create.post': 'पोस्ट बनाएं',
    'community.post.title': 'पोस्ट का शीर्षक',
    'community.post.content': 'अपने विचार साझा करें...',
    'community.submit.post': 'पोस्ट जमा करें',
    
    // Job application related
    'jobs.apply.now': 'अभी आवेदन करें',
    'jobs.view.details': 'विवरण देखें',
    'jobs.application.title': 'नौकरी आवेदन',
    'jobs.application.subtitle': 'आवेदन करने के लिए कृपया नीचे दिया फॉर्म भरें',
    'jobs.application.form.name': 'पूर्ण नाव',
    'jobs.application.form.email': 'ईमेल पत्ता',
    'jobs.application.form.phone': 'फोन नंबर',
    'jobs.application.form.experience': 'कार्य अनुभव',
    'jobs.application.form.skills': 'संबंधित कौशल',
    'jobs.application.form.cover': 'कवर लेटर',
    'jobs.application.form.resume': 'रेज्युमे अपलोड करें',
    'jobs.application.form.submit': 'आवेदन जमा करें',
    'jobs.application.success': 'आपका आवेदन सफलतापूर्वक जमा किया गया है!',
    'jobs.application.error': 'आपका आवेदन जमा करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    'jobs.types.remote': 'रिमोट',
    'jobs.types.hybrid': 'हायब्रिड',
    'jobs.types.onsite': 'ऑनसाइट'
  },
  marathi: {
    'welcome': 'पुन्हा स्वागत आहे, प्रिया!',
    'loading': 'लोडिंग...',
    'name': 'नाम',
    'submit': 'सबमिट करें',
    'mentor.title': 'AI मेंटर',
    'mentor.subtitle': 'तुमच्या शिकण्याच्या प्रवासात मार्गदर्शन करण्यासाठी आणि भावनिक आधार देण्यासाठी तुमचा वैयक्तिक AI मेंटर',
    'mentor.description': '',
    'mentor.features.title': 'मेंटर वैशिष्ट्ये',
    'mentor.features.description': 'तुमचा AI मेंटर तुम्हाला कसा मदत करू शकतो',
    'mentor.voice.title': 'आवाज समर्थन',
    'mentor.voice.description': 'मदतीसाठी तुमच्या पसंतीच्या भाषेत बोला',
    'mentor.learning.title': 'शिकण्याचे मार्गदर्शन',
    'mentor.learning.description': 'अभ्यासक्रम सामग्री आणि असाइनमेंट्ससह मदत मिळवा',
    'mentor.career.title': 'करिअर सल्ला',
    'mentor.career.description': 'नोकरी अर्ज आणि मुलाखतींवर मार्गदर्शन',
    'mentor.emotional.title': 'भावनिक आधार',
    'mentor.emotional.description': 'जेव्हा तुम्हाला गरज असेल तेव्हा प्रेरणा आणि प्रोत्साहन',
    'mentor.suggested.title': 'सुचवलेले विषय',
    'mentor.suggested.description': 'तुम्ही विचारू इच्छित प्रश्न',
    'mentor.typing.question': 'मी डेटा एंट्रीसाठी माझा टाइपिंग वेग कसा सुधारू शकतो?',
    'mentor.interview.question': 'मी माझ्या आगामी जॉब इंटरव्ह्यूबद्दल नर्व्हस आहे. काही टिप्स?',
    'mentor.excel.question': 'तुम्ही Excel VLOOKUP फंक्शन सोप्या शब्दांत समजावून सांगू शकता का?',
    'mentor.email.question': 'मी नोकरीच्या अर्जांसाठी व्यावसायिक ईमेल कसा तयार करू?',
    'mentor.welcome': '',
    'mentor.thinking': 'विचार करत आहे...',
    'mentor.loading': 'AI मेंटर लोड होत आहे...',
    'mentor.placeholder': 'तुमचा संदेश टाइप करा...',
    'mentor.typing.response': '',
    'mentor.interview.response': '',
    'mentor.excel.response': '',
    'mentor.email.response': '',
    'mentor.default.response': '',
    
    // Dashboard translations
    'language.label': 'भाषा:',
    'language.select': 'भाषा चुनें',
    'dashboard.title': 'डैशबोर्ड',
    'dashboard.subtitle': 'अपनी सीखने की प्रगति और अवसरों को ट्रैक करें',
    'dashboard.learning.path': 'AI Powered Personalized Path',
    'dashboard.learning.progress': 'सीखने की प्रगति',
    'dashboard.progress.week': 'पिछले सप्ताह से +12%',
    'dashboard.courses.completed': 'पूरे किए गए कोर्स',
    'dashboard.courses.inprogress': '2 कोर्स प्रगति पर',
    'dashboard.xp.points': 'XP अंक',
    'dashboard.xp.next': 'अगले स्तर तक 250 अंक',
    'dashboard.continue.learning': 'सीखना जारी रखें',
    'dashboard.view.all': 'सभी कोर्स देखें',
    'dashboard.analytics.title': 'आपकी लर्निंग एनालिटिक्स',
    'dashboard.analytics.description': 'पिछले सप्ताह की अपनी प्रगति को ट्रैक करें',
    'dashboard.skills.title': 'कौशल प्रगति',
    'dashboard.skills.description': 'आपके वर्तमान कौशल स्तर',
    'dashboard.jobs.title': 'अनुशंसित नौकरी के अवसर',
    'dashboard.jobs.description': 'आपके कौशल और प्रगति के आधार पर',
    'dashboard.view.opportunities': 'सभी अवसर देखें',
    'dashboard.community.title': 'सामुदायिक गतिविधि',
    'dashboard.community.description': 'हाल की चर्चाएँ और सहकर्मी सीखना',
    'dashboard.join.community': 'समुदाय से जुड़ें',
    'dashboard.tabs.activity': 'हाल की गतिविधि',
    'dashboard.tabs.peers': 'आपके पास के साथी',
    'dashboard.recommended.courses': 'अनुशंसित कोर्स',
    'dashboard.job.opportunities': 'नौकरी के अवसर',
    
    // Course related translations
    'courses.digital': 'डिजिटल साक्षरता की मूल बातें',
    'courses.data': 'बुनियादी डेटा एंट्री कौशल',
    'courses.communication': 'संचार कौशल',
    'courses.status.inprogress': 'प्रगति पर',
    'courses.status.notstarted': 'शुरू नहीं किया',
    'courses.time.remaining': '{time} शेष',
    'courses.time.total': 'कुल {time}',
    
    // Job related translations
    'jobs.dataentry': 'डेटा एंट्री विशेषज्ञ',
    'jobs.customer': 'ग्राहक सहायता सहयोगी',
    'jobs.virtual': 'वर्चुअल असिस्टेंट',
    'jobs.match': '{percent}% मिलान',
    'jobs.apply': 'अभी आवेदन करें',
    
    // Company names
    'companies.techsolutions': 'टेकसॉल्यूशंस इंक.',
    'companies.globalservices': 'ग्लोबलसर्विसेज लिमिटेड',
    'companies.supporthub': 'सपोर्टहब',
    
    // Community related translations
    'community.tabs.discussions': 'चर्चाएँ',
    'community.tabs.peers': 'सहकर्मी सीखना',
    'community.post1': 'क्या किसी ने डेटा एंट्री सर्टिफिकेशन पूरा किया है? मैं अध्ययन युक्तियाँ ढूँढ रहा हूँ!',
    'community.post2': 'प्लेटफॉर्म के माध्यम से मुझे अपना पहला फ्रीलांस काम मिला! बहुत उत्साहित हूँ!',
    'community.post3': 'मैं डिजिटल साक्षरता कोर्स के लिए एक अध्ययन समूह आयोजित कर रहा हूँ। कोई रुचि रखता है?',
    'community.post4': 'संचार कौशल मॉड्यूल से अपने नोट्स साझा कर रहा हूँ। उम्मीद है कि यह मदद करेगा!',
    
    // User names
    'users.meera': 'मीरा के.',
    'users.anjali': 'अंजली टी.',
    'users.lakshmi': 'लक्ष्मी आर.',
    'users.priyanka': 'प्रियंका एम.',
    
    // Time indicators
    'time.hours': '{hours} घंटे पहले',
    'time.days': '{days} दिन पहले',
    
    // Days of week
    'days.mon': 'सोम',
    'days.tue': 'मंगल',
    'days.wed': 'बुध',
    'days.thu': 'गुरु',
    'days.fri': 'शुक्र',
    'days.sat': 'शनि',
    'days.sun': 'रवि',
    
    // Skills
    'skills.digital': 'डिजिटल साक्षरता',
    'skills.communication': 'संचार',
    'skills.data': 'डेटा एंट्री',
    'skills.customer': 'ग्राहक सेवा',
    'skills.content': 'कंटेंट राइटिंग',
    'skills.typing': 'टाइपिंग',
    'skills.excel': 'एक्सेल',
    'skills.organization': 'संगठन',
    
    // Achievement related translations
    'achievements.title': 'अलीकडील कामगिरी',
    'achievements.view.all': 'सर्व कामगिरी पहा',
    'achievements.fast.learner.title': 'वेगवान शिक्षार्थी',
    'achievements.fast.learner.desc': 'एका दिवसात 5 धडे पूर्ण करा',
    'achievements.consistent.title': 'सातत्यपूर्ण प्रयत्न',
    'achievements.consistent.desc': 'सलग 7 दिवस लॉगिन करा',
    'achievements.quiz.title': 'क्विझ मास्टर',
    'achievements.quiz.desc': '3 क्विझमध्ये 100% गुण मिळवा',
    'achievements.course.title': 'कोर्स चॅम्पियन',
    'achievements.course.desc': 'तुमचा पहिला कोर्स पूर्ण करें',
    'achievements.earned': 'मिळवले',
    
    // Community related translations
    'community.join.conversation': 'संभाषणात सामील व्हा',
    'community.replies': '{replies} प्रतिक्रिया',
    'community.create.post': 'पोस्ट तयार करा',
    'community.post.title': 'पोस्ट शीर्षक',
    'community.post.content': 'तुमचे विचार शेअर करा...',
    'community.submit.post': 'पोस्ट सबमिट करा',
    
    // Job application related
    'jobs.apply.now': 'आत्ता अर्ज करा',
    'jobs.view.details': 'तपशील पहा',
    'jobs.application.title': 'नोकरी अर्ज',
    'jobs.application.subtitle': 'अर्ज करण्यासाठी कृपया खालील फॉर्म भरा',
    'jobs.application.form.name': 'पूर्ति नाव',
    'jobs.application.form.email': 'ईमेल पत्ता',
    'jobs.application.form.phone': 'फोन नंबर',
    'jobs.application.form.experience': 'कामाचा अनुभव',
    'jobs.application.form.skills': 'संबंधित कौशल्ये',
    'jobs.application.form.cover': 'कव्हर लेटर',
    'jobs.application.form.resume': 'रिझ्युमे अपलोड करा',
    'jobs.application.form.submit': 'अर्ज सबमिट करा',
    'jobs.application.success': 'तुमचा अर्ज यशस्वीरित्या सबमिट केला गेला आहे!',
    'jobs.application.error': 'तुमचा अर्ज सबमिट करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
    'jobs.types.remote': 'रिमोट',
    'jobs.types.hybrid': 'हायब्रिड',
    'jobs.types.onsite': 'ऑनसाईट'
  },
  tamil: {
    'welcome': 'மீண்டும் வரவேற்கிறோம், பிரியா!',
    'loading': 'லோடிங்...',
    'name': 'பெயர்',
    'submit': 'சமிடுக',
    'mentor.title': 'AI வழிகாட்டி',
    'mentor.subtitle': 'உங்கள் கற்றல் பயணத்தை வழிநடத்தவும், உணர்ச்சி ஆதரவை வழங்கவும் உங்களுக்கான தனிப்பயனாக்கப்பட்ட AI வழிகாட்டி',
    'mentor.description': '',
    'mentor.features.title': 'வழிகாட்டி அம்சங்கள்',
    'mentor.features.description': 'உங்கள் AI வழிகாட்டி உங்களுக்கு எவ்வாறு உதவ முடியும்',
    'mentor.voice.title': 'குரல் ஆதரவு',
    'mentor.voice.description': 'உதவிக்கு உங்கள் விருப்பமான மொழியில் பேசுங்கள்',
    'mentor.learning.title': 'கற்றல் வழிகாட்டுதல்',
    'mentor.learning.description': 'பாடத்திட்ட உள்ளடக்கம் மற்றும் பணிகளுடன் உதவி பெறுங்கள்',
    'mentor.career.title': 'வேலைவாய்ப்பு ஆலோசனை',
    'mentor.career.description': 'வேலை விண்ணப்பங்கள் மற்றும் நேர்காணல்கள் குறித்த வழிகாட்டுதல்',
    'mentor.emotional.title': 'உணர்ச்சி ஆதரவு',
    'mentor.emotional.description': 'உங்களுக்குத் தேவைப்படும்போது ஊக்கமும் ஊக்கமும்',
    'mentor.suggested.title': 'பரிந்துரைக்கப்பட்ட தலைப்புகள்',
    'mentor.suggested.description': 'நீங்கள் கேட்க விரும்பும் கேள்விகள்',
    'mentor.typing.question': 'தரவு உள்ளீட்டிற்கான எனது டட்டச்சு வேகத்தை எவ்வாறு மேம்படுத்துவது?',
    'mentor.interview.question': 'என் ராவிருக்கும் வேலை நேர்காணலைப் பற்றி நான் பதற்றமாக இருக்கிறேன். ஏதேனும் குறிப்புகள்?',
    'mentor.excel.question': 'Excel VLOOKUP செயல்பாட்டை எளிய வார்த்தைகளில் விளக்க முடியுமா?',
    'mentor.email.question': 'வேலை விண்ணப்பங்களுக்கான தொழில்முறை மின்னஞ்சலை எவ்வாறு உருவாக்குவது?',
    'mentor.welcome': '',
    'mentor.thinking': 'யோசிக்கிறேன்...',
    'mentor.loading': 'AI வழிகாட்டி ஏற்றப்படுகிறது...',
    'mentor.placeholder': 'உங்கள் செய்தியைத் தட்டச்சு செய்யவும்...',
    'mentor.typing.response': '',
    'mentor.interview.response': '',
    'mentor.excel.response': '',
    'mentor.email.response': '',
    'mentor.default.response': '',
    
    // Dashboard translations
    'language.label': 'மொழி:',
    'language.select': 'மொழியைத் தேர்ந்தெடு',
    'dashboard.title': 'டார்ட்போர்ட்',
    'dashboard.subtitle': 'உங்கள் கற்றல் நிலுவையை நிர்வாணம் செய்யவும்',
    'dashboard.learning.path': 'AI Powered Personalized Path',
    'dashboard.learning.progress': 'கற்றல் நிலுவை',
    'dashboard.progress.week': 'கடந்த வாரத்திலிருந்து +12%',
    'dashboard.courses.completed': 'முடிந்த பாடங்கள்',
    'dashboard.courses.inprogress': '2 பாடங்கள் நிலுவையில்',
    'dashboard.xp.points': 'XP புள்ளிகள்',
    'dashboard.xp.next': 'அடுத்த மடங்கு 250 புள்ளிகள்',
    'dashboard.continue.learning': 'கற்றல் நேரத்தை நீட்டிக்கவும்',
    'dashboard.view.all': 'அனைத்து பாடங்களையும் காண்க',
    'dashboard.analytics.title': 'உங்கள் கற்றல் அங்கியமைப்பு',
    'dashboard.analytics.description': 'கடந்த வாரத்தில் உங்கள் நிலுவையை நிர்வாணம் செய்யவும்',
    'dashboard.skills.title': 'குறியீட்டு நிலுவை',
    'dashboard.skills.description': 'உங்கள் நிலுவை மடங்கு',
    'dashboard.jobs.title': 'பரிந்துரைக்கப்பட்ட நேரம் வேலை',
    'dashboard.jobs.description': 'உங்கள் குறியீட்டு மற்றும் நிலுவையை அடிப்படையாக',
    'dashboard.view.opportunities': 'அனைத்து அவஸாப்புகளையும் காண்க',
    'dashboard.community.title': 'சமூக நிலுவை',
    'dashboard.community.description': 'கடந்த செய்திகள் மற்றும் பிரியர் கற்றல்',
    'dashboard.join.community': 'சமூகத்தை இணைய',
    'dashboard.tabs.activity': 'கடந்த நிலுவை',
    'dashboard.tabs.peers': 'உங்கள் அருகிலுள்ள பிரியர்',
    'dashboard.recommended.courses': 'பரிந்துரைக்கப்பட்ட பாடங்கள்',
    'dashboard.job.opportunities': 'வேலை அவஸாப்புகள்',
    
    // Course related translations
    'courses.digital': 'டிஜிடல் நிற்கும் அடிப்படைகள்',
    'courses.data': 'அடிப்படை தரவு உள்ளீட்டு முன்னியாக்கம்',
    'courses.communication': 'சமூகம் முன்னியாக்கம்',
    'courses.status.inprogress': 'நிலுவையில்',
    'courses.status.notstarted': 'தொடங்கவில்லை',
    'courses.time.remaining': '{time} மீதி',
    'courses.time.total': 'மொத்த {time}',
    
    // Job related translations
    'jobs.dataentry': 'தரவு உள்ளீட்டு விளக்கி',
    'jobs.customer': 'வாடகை ஆதரவு பிரியர்',
    'jobs.virtual': 'வர்சுல் அஸிஸ்டெண்ட்',
    'jobs.match': '{percent}% பொருத்தம்',
    'jobs.apply': 'இப்போது விண்ணப்பிக்கவும்',
    
    // Company names
    'companies.techsolutions': 'டெக்சோலூஷன்ஸ் இணைய',
    'companies.globalservices': 'கிளோபல் சர்விஸ் லிமிடெட்',
    'companies.supporthub': 'ஆதரவுஹப்',
    
    // Community related translations
    'community.tabs.discussions': 'செய்திகள்',
    'community.tabs.peers': 'பிரியர் கற்றல்',
    'community.post1': 'யாராவர் தரவு உள்ளீட்டு சாரியாக்கம் முடிந்தது? நான் கற்றல் யுக்திகள் தேடுகிறேன்!',
    'community.post2': 'ப்ளெட்பிரைம் மூலம் நான் என் முதல் பொருந்திய வேலை பெற்றேன்! மிகவும் மகிழ்ச்சியாக இருக்கிறேன்!',
    'community.post3': 'நான் டிஜிடல் நிற்கும் பாடங்கள் கொண்ட ஒரு பாடம் கொண்டு ஒரு பாடம் அடையும். நான் கொண்டு இருக்கிறேனா?',
    'community.post4': 'சமூகம் மூலம் நான் என் கருத்துகளை பகிர்ந்து இருக்கிறேன். நம்பிக்கையாக இது உதவும்!',
    
    // User names
    'users.meera': 'மீரா கே.',
    'users.anjali': 'அஞ்ஜலி டி.',
    'users.lakshmi': 'லக்ஷ்மி ர.',
    'users.priyanka': 'ப்ரியங்கா ஏம.',
    
    // Time indicators
    'time.hours': '{hours} மணிநேரம் முன்',
    'time.days': '{days} நாட்கள் முன்',
    
    // Days of week
    'days.mon': 'திங்கள்',
    'days.tue': 'வியாழன்',
    'days.wed': 'வெள்ளி',
    'days.thu': 'வியாழன்',
    'days.fri': 'வெள்ளி',
    'days.sat': 'சனி',
    'days.sun': 'ஞாயிற்று',
    
    // Skills
    'skills.digital': 'டிஜிடல் நிற்கும்',
    'skills.communication': 'சமூகம்',
    'skills.data': 'தரவு உள்ளீட்டு',
    'skills.customer': 'வாடகை ஆதரவு',
    'skills.content': 'உள்ளடக்க எழுத்து',
    'skills.typing': 'டிப்புடைய திருத்தம்',
    'skills.excel': 'ஏக்சல்',
    'skills.organization': 'அமைப்பு',
    
    // Achievement related translations
    'achievements.title': 'சமீபத்திய சாதனைகள்',
    'achievements.view.all': 'அனைத்து சாதனைகளையும் காண்க',
    'achievements.fast.learner.title': 'வேகமாக நிற்கும் கற்றல்',
    'achievements.fast.learner.desc': 'ஒரு நாளில் 5 பாடங்களை முடிக்கவும்',
    'achievements.consistent.title': 'நிரல்திர முயற்சி',
    'achievements.consistent.desc': '7 நாட்கள் தொடர்ந்து உள்நுழைக',
    'achievements.quiz.title': 'வினாடி வினா நிபுணர்',
    'achievements.quiz.desc': '3 வினாடி வினாக்களில் 100% மதிப்பெண் பெறுக',
    'achievements.course.title': 'பாடநெறி சாம்பியன்',
    'achievements.course.desc': 'உங்கள் முதல் பாடநெறியை முடிக்கவும்',
    'achievements.earned': 'பெறப்பட்டது',
    
    // Community related translations
    'community.join.conversation': 'உரையாடலில் சேர',
    'community.replies': '{replies} பதில்கள்',
    'community.create.post': 'இடுகை உருவாக்கு',
    'community.post.title': 'இடுகை தலைப்பு',
    'community.post.content': 'உங்கள் கருத்துக்களை பகிர்ந்து இருக்கிறேன்...',
    'community.submit.post': 'இடுகையை சமர்ப்பி',
    
    // Job application related
    'jobs.apply.now': 'இப்போது விண்ணப்பிக்கவும்',
    'jobs.view.details': 'விவரங்களைக் காண்க',
    'jobs.application.title': 'வேலை விண்ணப்பம்',
    'jobs.application.subtitle': 'விண்ணப்பிக்க கீழே உள்ள படிவத்தை நிரப்பவும்',
    'jobs.application.form.name': 'முழு பெயர்',
    'jobs.application.form.email': 'மின்னஞ்சல் முகவரி',
    'jobs.application.form.phone': 'தொலைபேசி எண்',
    'jobs.application.form.experience': 'வேலை அனுபவம்',
    'jobs.application.form.skills': 'தொடர்புடைய திறன்கள்',
    'jobs.application.form.cover': 'கவர் கடிதம்',
    'jobs.application.form.resume': 'ரெசுமேவை பதிவேற்றவும்',
    'jobs.application.form.submit': 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    'jobs.application.success': 'உங்கள் விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    'jobs.application.error': 'உங்கள் விண்ணப்பத்தை சமர்ப்பிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    'jobs.types.remote': 'தொலைதூர',
    'jobs.types.hybrid': 'கலப்பு',
    'jobs.types.onsite': 'அலுவலகத்தில்'
  },
  telugu: {
    'welcome': 'మళ్లీ స్వాగతం, ప్రియా!',
    'loading': 'లోడించు...',
    'name': 'పేరు',
    'submit': 'సబ్మిట్ చేయం',
    'mentor.title': 'AI మెంటార్',
    'mentor.subtitle': 'మీ అభ్యాస ప్రయాణాన్ని మార్గనిర్దేశం చేయడానికి మరియు భావోద్వేగ మద్దతును అందించడానికి మీ వ్యక్తిగతీకరించిన AI మెంటార్',
    'mentor.description': '',
    'mentor.features.title': 'మెంటార్ ఫీచర్లు',
    'mentor.features.description': 'మీ AI మెంటార్ మీకు ఎలా సహాయపడగలదు',
    'mentor.voice.title': 'వాయిస్ సపోర్ట్',
    'mentor.voice.description': 'సహాయం కోసం మీకు ఇష్టమైన భాషలో మాట్లాడండి',
    'mentor.learning.title': 'అభ్యాస మార్గదర్శకత్వం',
    'mentor.learning.description': 'కోర్సు కంటెంట్ మరియు అసైన్‌మెంట్‌లతో సహాయం పొందండి',
    'mentor.career.title': 'కెరీర్ సలహా',
    'mentor.career.description': 'ఉద్యోగ దరఖాస్తులు మరియు ఇంటర్వ్యూలపై మార్గదర్శకత్వం',
    'mentor.emotional.title': 'భావోద్వేగ మద్దతు',
    'mentor.emotional.description': 'మీకు అవసరమైనప్పుడు ప్రేరణ మరియు ప్రోత్సాహం',
    'mentor.suggested.title': 'సూచించిన అంశాలు',
    'mentor.suggested.description': 'మీరు అడగాలనుకుంటున్న ప్రశ్నలు',
    'mentor.typing.question': 'డేటా ఎంట్రీ కోసం నా టైపింగ్ వేగాన్ని ఎలా మెరుగుపరచుకోవాలి?',
    'mentor.interview.question': 'నా రాబోయే జాబ్ ఇంటర్వ్యూ గురించి నేను నర్వస్‌గా ఉన్నాను. ఏవైనా చిట్కాలు ఉన్నాయా?',
    'mentor.excel.question': 'Excel VLOOKUP ఫంక్షన్‌ను సరళమైన పదాలలో వివరించగలరా?',
    'mentor.email.question': 'ఉద్యోగ దరఖాస్తుల కోసం ప్రొఫెషనల్ ఇమెయిల్‌ను ఎలా సృష్టించాలి?',
    'mentor.welcome': '',
    'mentor.thinking': 'ఆలోచిస్తున్నాను...',
    'mentor.loading': 'AI మెంటార్ లోడ్ అవుతోంది...',
    'mentor.placeholder': 'మీ సందేశాన్ని టైప్ చేయండి...',
    'mentor.typing.response': '',
    'mentor.interview.response': '',
    'mentor.excel.response': '',
    'mentor.email.response': '',
    'mentor.default.response': '',
    
    // Dashboard translations
    'language.label': 'భాష:',
    'language.select': 'భాష ఎంచుకోండి',
    'dashboard.title': 'డాస్బోర్డ్',
    'dashboard.subtitle': 'మీ కఱ్ఱల నిల్వ చేయం',
    'dashboard.learning.path': 'AI Powered Personalized Path',
    'dashboard.learning.progress': 'కఱ్ఱల నిల్వ',
    'dashboard.progress.week': 'గారు వారం నుండి +12%',
    'dashboard.courses.completed': 'ముట్టిన కఱ్ఱల',
    'dashboard.courses.inprogress': '2 కఱ్ఱల నిల్వ',
    'dashboard.xp.points': 'XP పాయింట్లు',
    'dashboard.xp.next': 'తదుతు స్తరంలో 250 పాయింట్లు',
    'dashboard.continue.learning': 'కఱ్ఱల నిల్వ చేయం',
    'dashboard.view.all': 'అన్ని కఱ్ఱలు చూడం',
    'dashboard.analytics.title': 'మీ కఱ్ఱల అంలియమ్మాయమ్',
    'dashboard.analytics.description': 'గారు వారం మీ నిల్వ చేయం',
    'dashboard.skills.title': 'కుర్చియాల నిల్వ',
    'dashboard.skills.description': 'మీ ప్రస్తుత కుర్చియాల స్తరాలు',
    'dashboard.jobs.title': 'ప్రాస్తుతి వేలెన్న పని అవసరాలు',
    'dashboard.jobs.description': 'మీ కుర్చియాల మరియు నిల్వ ప్రాస్తుతి ఆధారంగా',
    'dashboard.view.opportunities': 'అన్ని పని అవసరాలు చూడం',
    'dashboard.community.title': 'సమూహ నిల్వ',
    'dashboard.community.description': 'గారు చర్చలు మరియు ప్రియర్ కఱ్ఱల',
    'dashboard.join.community': 'సమూహాని చేరం',
    'dashboard.tabs.activity': 'గారు నిల్వ',
    'dashboard.tabs.peers': 'మీ అరుకు ప్రియర్',
    'dashboard.recommended.courses': 'ప్రాస్తుతి కఱ్ఱల',
    'dashboard.job.opportunities': 'పని అవసరాలు',
    
    // Course related translations
    'courses.digital': 'డిజిటల్ నిల్వ అటియాక్షరాలు',
    'courses.data': 'అటియాక్షరాల దారిత్తు అటియాక్షరాలు',
    'courses.communication': 'సమూహ అటియాక్షరాలు',
    'courses.status.inprogress': 'నిల్వ',
    'courses.status.notstarted': 'ప్రారంభించని',
    'courses.time.remaining': '{time} శేషం',
    'courses.time.total': 'మొత్తం {time}',
    
    // Job related translations
    'jobs.dataentry': 'దారిత్తు అటియాక్షరాల విశాల్యాలు',
    'jobs.customer': 'గ్రాహక ఆదాయాలు ప్రియర్',
    'jobs.virtual': 'వర్చుల్ అసిస్టెంట్',
    'jobs.match': '{percent}% మిలియం',
    'jobs.apply': 'ఇప్పుడే అడిగం',
    
    // Company names
    'companies.techsolutions': 'టెక్సోలూషన్స్ ఇంక.',
    'companies.globalservices': 'గ్లోబల్ సర్విస్ లిమిటెడ్',
    'companies.supporthub': 'ఆదాయాలు హబ్',
    
    // Community related translations
    'community.tabs.discussions': 'చర్చలు',
    'community.tabs.peers': 'ప్రియర్ కఱ్ఱల',
    'community.post1': 'యారావర్ దారిత్తు సర్టిఫికేషన్ ముట్టినా? నాకు కఱ్ఱల యుక్తికలు కనుగొనాల్స్!',
    'community.post2': 'ప్లేట్ఫారమ్ మూలాల మాధాల్యం నాకు ఎన్నో వేలెన్న పని పొందించింది! నాకు మిక్కలు ఆనందంగా ఉంది!',
    'community.post3': 'నాకు డిజిటల్ నిల్వ కఱ్ఱల కారణం ఒక కఱ్ఱల అడిగాల్స్. నాకు కారణం ఉంది?',
    'community.post4': 'సమూహాని మూలాల మాధాల్యం నాకు నా గమనాలు పంచుకోండి. నమ్మనం ఉంది!',
    
    // User names
    'users.meera': 'మీరా కే.',
    'users.anjali': 'అంజలి టి.',
    'users.lakshmi': 'లక్ష్మి ర.',
    'users.priyanka': 'ప్రియంకా ఏమ.',
    
    // Time indicators
    'time.hours': '{hours} గంటల ముందు',
    'time.days': '{days} రోజుల ముందు',
    
    // Days of week
    'days.mon': 'సోమారి',
    'days.tue': 'మంగళారి',
    'days.wed': 'బుధారి',
    'days.thu': 'గురువారి',
    'days.fri': 'శుక్రారి',
    'days.sat': 'శనివారి',
    'days.sun': 'రవివారి',
    
    // Skills
    'skills.digital': 'డిజిటల్ నిల్వ',
    'skills.communication': 'సమూహ',
    'skills.data': 'దారిత్తు',
    'skills.customer': 'గ్రాహక సేవ',
    'skills.content': 'ఉళ్ళటక ఎంచ్చిన',
    'skills.typing': 'టైప్య్',
    'skills.excel': 'ఎక్సెల్',
    'skills.organization': 'సమూహ'
  }
};

// Helper function to get translation
export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] || translations.english[key];
} 