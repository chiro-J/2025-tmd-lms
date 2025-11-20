import { useState } from 'react'
import { useProfile } from '../../contexts/ProfileContext'
import ProfilePhotoModal from './ProfilePhotoModal'
import ProfilePhotoSection from './resume/ProfilePhotoSection'
import BasicInfoSection from './resume/BasicInfoSection'
import BioSection from './resume/BioSection'
import LanguageSection from './resume/LanguageSection'
import TrainingSection from './resume/TrainingSection'
import EducationSection from './resume/EducationSection'
import ExperienceSection from './resume/ExperienceSection'
import ProjectSection from './resume/ProjectSection'
import CertificateSection from './resume/CertificateSection'
import SkillsSection from './resume/SkillsSection'

interface ResumeTabProps {
  isEditMode: boolean
}

export default function ResumeTab({ isEditMode }: ResumeTabProps) {
  const {
    profileData,
    updateProfile,
    addEducation,
    updateEducation,
    deleteEducation,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addLanguageSkill,
    updateLanguageSkill,
    deleteLanguageSkill,
    addTraining,
    updateTraining,
    deleteTraining,
    saveToLocalStorage
  } = useProfile()

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)

  const handleApplyPhoto = (imageData: string) => {
    updateProfile({ resumePhoto: imageData })
    saveToLocalStorage()
  }

  const handleRemovePhoto = () => {
    updateProfile({ resumePhoto: '' })
    saveToLocalStorage()
  }

  const handleBasicInfoUpdate = (field: string, value: string) => {
    updateProfile({ [field]: value })
    saveToLocalStorage()
  }

  const handleBioUpdate = (bio: string) => {
    updateProfile({ bio })
    saveToLocalStorage()
  }

  const handleSkillAdd = (skill: string) => {
    updateProfile({ languages: [...profileData.languages, skill] })
    saveToLocalStorage()
  }

  const handleSkillRemove = (skill: string) => {
    updateProfile({ languages: profileData.languages.filter(s => s !== skill) })
    saveToLocalStorage()
  }

  return (
    <>
      <div className="space-y-8">
        {/* Profile Photo & Contact Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          <ProfilePhotoSection
            photoUrl={profileData.resumePhoto}
            onUploadClick={() => setIsPhotoModalOpen(true)}
            onRemoveClick={handleRemovePhoto}
            isEditMode={isEditMode}
          />
          <BasicInfoSection
            email={profileData.email}
            portfolioUrl={profileData.portfolioUrl}
            phone={profileData.phone}
            job={profileData.job}
            address={profileData.address}
            onUpdate={handleBasicInfoUpdate}
            isEditMode={isEditMode}
          />
        </div>

        {/* Bio Section */}
        <BioSection
          bio={profileData.bio}
          onUpdate={handleBioUpdate}
          isEditMode={isEditMode}
        />

        {/* Projects Section */}
        <ProjectSection
          projects={profileData.projects}
          onAdd={(data) => {
            addProject(data)
            saveToLocalStorage()
          }}
          onUpdate={(id, data) => {
            updateProject(id, data)
            saveToLocalStorage()
          }}
          onDelete={(id) => {
            deleteProject(id)
            saveToLocalStorage()
          }}
          isEditMode={isEditMode}
        />

        {/* Language & Training Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LanguageSection
            languages={profileData.languageSkills}
            onAdd={(data) => {
              addLanguageSkill(data)
              saveToLocalStorage()
            }}
            onUpdate={(id, data) => {
              updateLanguageSkill(id, data)
              saveToLocalStorage()
            }}
            onDelete={(id) => {
              deleteLanguageSkill(id)
              saveToLocalStorage()
            }}
            isEditMode={isEditMode}
          />
          <TrainingSection
            trainings={profileData.trainings}
            onAdd={(data) => {
              addTraining(data)
              saveToLocalStorage()
            }}
            onUpdate={(id, data) => {
              updateTraining(id, data)
              saveToLocalStorage()
            }}
            onDelete={(id) => {
              deleteTraining(id)
              saveToLocalStorage()
            }}
            isEditMode={isEditMode}
          />
        </div>

        {/* Education & Experience Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EducationSection
            educations={profileData.education}
            onAdd={(data) => {
              addEducation(data)
              saveToLocalStorage()
            }}
            onUpdate={(id, data) => {
              updateEducation(id, data)
              saveToLocalStorage()
            }}
            onDelete={(id) => {
              deleteEducation(id)
              saveToLocalStorage()
            }}
            isEditMode={isEditMode}
          />
          <ExperienceSection
            experiences={profileData.experience}
            onAdd={(data) => {
              addExperience(data)
              saveToLocalStorage()
            }}
            onUpdate={(id, data) => {
              updateExperience(id, data)
              saveToLocalStorage()
            }}
            onDelete={(id) => {
              deleteExperience(id)
              saveToLocalStorage()
            }}
            isEditMode={isEditMode}
          />
        </div>

        {/* Certificates & Skills Section - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CertificateSection
            certificates={profileData.certificates}
            onAdd={(data) => {
              addCertificate(data)
              saveToLocalStorage()
            }}
            onUpdate={(id, data) => {
              updateCertificate(id, data)
              saveToLocalStorage()
            }}
            onDelete={(id) => {
              deleteCertificate(id)
              saveToLocalStorage()
            }}
            isEditMode={isEditMode}
          />
          <SkillsSection
            skills={profileData.languages}
            onAdd={handleSkillAdd}
            onRemove={handleSkillRemove}
            isEditMode={isEditMode}
          />
        </div>
      </div>

      {/* Profile Photo Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onApply={handleApplyPhoto}
        currentPhoto={profileData.resumePhoto}
      />
    </>
  )
}
