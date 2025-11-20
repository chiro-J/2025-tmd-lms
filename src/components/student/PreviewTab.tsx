import { useState, useEffect } from 'react'
import { FileDown, Printer, Palette, Share2, ArrowUp, User } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useProfile } from '../../contexts/ProfileContext'
import type { ResumeTemplate } from '../../contexts/ProfileContext'

export default function PreviewTab() {
  const { profileData, updateProfile, saveToLocalStorage } = useProfile()
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(profileData.resumeTemplate || 'modern')
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const templates: { id: ResumeTemplate; name: string; description: string }[] = [
    { id: 'modern', name: '모던', description: '깔끔하고 현대적인 디자인' },
    { id: 'classic', name: '클래식', description: '전통적이고 격식있는 스타일' },
    { id: 'minimal', name: '미니멀', description: '단순하고 심플한 레이아웃' },
    { id: 'creative', name: '크리에이티브', description: '창의적이고 독특한 디자인' }
  ]

  const handleTemplateChange = (template: ResumeTemplate) => {
    setSelectedTemplate(template)
    updateProfile({ resumeTemplate: template })
    saveToLocalStorage()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    try {
      // html2pdf 라이브러리 사용
      const element = document.getElementById('resume-preview')
      if (!element) return

      // 동적 import 시도
      let html2pdf
      try {
        // @ts-ignore
        const html2pdfModule = await import('html2pdf.js')
        html2pdf = html2pdfModule.default || html2pdfModule
      } catch (importError) {
        // 라이브러리가 없으면 인쇄 기능 사용
        console.error('html2pdf.js 로드 실패:', importError)
        alert('PDF 다운로드 기능을 사용하려면 html2pdf.js 라이브러리를 설치해주세요.\n\nnpm install html2pdf.js\n\n대신 인쇄 기능을 사용하시겠습니까?')
        window.print()
        return
      }

      const opt = {
        margin: 10,
        filename: `${profileData.name}_이력서.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }

      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('PDF 다운로드 실패:', error)
      alert('PDF 다운로드에 실패했습니다. 인쇄 기능을 사용해주세요.')
    }
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/resume/${profileData.email.replace('@', '-').replace('.', '-')}`
    navigator.clipboard.writeText(shareUrl)
    alert('이력서 공유 링크가 클립보드에 복사되었습니다!\n\n' + shareUrl)
  }

  // 이력서 완성도 계산
  const calculateCompleteness = () => {
    let total = 0
    let filled = 0

    // 기본 정보 (30%)
    total += 6
    if (profileData.name) filled++
    if (profileData.email) filled++
    if (profileData.phone) filled++
    if (profileData.address) filled++
    if (profileData.bio) filled++
    if (profileData.job) filled++

    // 학력 (15%)
    total += 1
    if (profileData.education.length > 0) filled++

    // 경력 (20%)
    total += 1
    if (profileData.experience.length > 0) filled++

    // 프로젝트 (20%)
    total += 1
    if (profileData.projects.length > 0) filled++

    // 자격증 (10%)
    total += 1
    if (profileData.certificates.length > 0) filled++

    // 기술 스택 (5%)
    total += 1
    if (profileData.languages.length > 0) filled++

    return Math.round((filled / total) * 100)
  }

  const completeness = calculateCompleteness()

  // 템플릿별 스타일 반환
  const getTemplateStyles = () => {
    switch (selectedTemplate) {
      case 'modern':
        return {
          container: 'bg-white text-gray-900',
          header: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg',
          section: 'border-l-4 border-blue-500 pl-4 mb-6',
          title: 'text-2xl font-bold text-blue-600 mb-4'
        }
      case 'classic':
        return {
          container: 'bg-white text-black',
          header: 'border-b-4 border-black p-6 text-center',
          section: 'mb-6 border-b border-gray-300 pb-4',
          title: 'text-xl font-serif font-bold text-black mb-3 uppercase'
        }
      case 'minimal':
        return {
          container: 'bg-white text-gray-800',
          header: 'p-6 border-b border-gray-200',
          section: 'mb-8',
          title: 'text-lg font-light text-gray-700 mb-3 tracking-wide'
        }
      case 'creative':
        return {
          container: 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900',
          header: 'bg-gradient-to-r from-pink-500 to-orange-500 text-white p-8 rounded-lg shadow-lg',
          section: 'bg-white rounded-lg p-4 mb-4 shadow-md',
          title: 'text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent mb-4'
        }
      default:
        return {
          container: 'bg-white text-gray-900',
          header: 'p-6 border-b-2 border-gray-300',
          section: 'mb-6',
          title: 'text-xl font-bold text-gray-800 mb-3'
        }
    }
  }

  const styles = getTemplateStyles()

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card className="p-4 print:hidden">
        <div className="flex items-center gap-3 mb-3">
          <Palette className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">템플릿 선택</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedTemplate === template.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-base-content/70">{template.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button onClick={handleShare} className="btn-outline">
          <Share2 className="h-4 w-4" />
          공유
        </Button>
        <Button onClick={handlePrint} className="btn-outline">
          <Printer className="h-4 w-4" />
          인쇄
        </Button>
        <Button onClick={handleDownloadPDF} className="btn-primary">
          <FileDown className="h-4 w-4" />
          PDF 다운로드
        </Button>
      </div>

      {/* Resume Preview */}
      <div id="resume-preview" className={`p-8 max-w-4xl mx-auto print:shadow-none ${styles.container}`}>
        {/* Header with Profile Image */}
        <div className={styles.header}>
          <div className="flex items-start gap-6">
            {/* Profile Photo (Resume) - 3:4 ratio */}
            <div className="flex-shrink-0">
              <div className="w-36 h-48 rounded-lg overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                {profileData.resumePhoto ? (
                  <img
                    src={profileData.resumePhoto}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                    <User className="h-16 w-16 text-white mb-2" />
                    <span className="text-xs text-white/80">720x960</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
              {profileData.job && (
                <p className="text-lg text-gray-600 mb-3">{profileData.job}</p>
              )}
              <div className="space-y-1 text-sm">
                {profileData.email && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>{profileData.email}</span>
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Phone:</span>
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.address && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Address:</span>
                    <span>{profileData.address}</span>
                  </div>
                )}
              </div>
              {(profileData.githubUrl || profileData.notionUrl) && (
                <div className="flex gap-3 mt-3">
                  {profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      GitHub
                    </a>
                  )}
                  {profileData.notionUrl && (
                    <a
                      href={profileData.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Notion
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profileData.bio && (
          <div className={styles.section}>
            <h2 className={styles.title}>소개</h2>
            <p className="whitespace-pre-wrap leading-relaxed">{profileData.bio}</p>
          </div>
        )}

        {/* Education */}
        {profileData.education.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.title}>학력</h2>
            <div className="space-y-4">
              {profileData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    <p className="text-sm text-gray-600">{edu.major} · {edu.degree}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">학점: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.startDate} ~ {edu.endDate}</p>
                    <p>{edu.status === 'graduated' ? '졸업' : edu.status === 'enrolled' ? '재학 중' : '중퇴'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profileData.experience.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.title}>경력</h2>
            <div className="space-y-4">
              {profileData.experience.map((exp) => (
                <div key={exp.id} className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{exp.company}</h3>
                    <p className="text-sm text-gray-600 mb-2">{exp.position}</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600 ml-4">
                    <p>{exp.startDate} ~</p>
                    <p>{exp.current ? '재직 중' : exp.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {profileData.projects.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.title}>프로젝트</h2>
            <div className="space-y-4">
              {profileData.projects.map((proj) => (
                <div key={proj.id} className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">{proj.role}</p>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block mb-2"
                      >
                        {proj.url}
                      </a>
                    )}
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.techStack.map((tech, idx) => (
                        <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600 ml-4">
                    <p>{proj.startDate} ~</p>
                    <p>{proj.current ? '진행 중' : proj.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {profileData.certificates.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.title}>자격증</h2>
            <div className="space-y-3">
              {profileData.certificates.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-sm text-gray-600">자격번호: {cert.credentialId}</p>
                    )}
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>취득: {cert.issueDate}</p>
                    {cert.expiryDate && <p>만료: {cert.expiryDate}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profileData.languages.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.title}>기술 스택</h2>
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((lang, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!profileData.bio &&
          profileData.education.length === 0 &&
          profileData.experience.length === 0 &&
          profileData.projects.length === 0 &&
          profileData.certificates.length === 0 &&
          profileData.languages.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>이력서에 표시할 정보가 없습니다.</p>
              <p className="text-sm mt-2">개인정보 또는 이력서 탭에서 정보를 입력해주세요.</p>
            </div>
          )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-primary-content p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 print:hidden"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

