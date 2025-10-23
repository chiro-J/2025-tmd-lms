import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { mockQuiz } from '../../mocks'
import type { Quiz, QuizQuestion } from '../../types'
import QuizReviewModal from '../../components/modals/QuizReviewModal'

export default function QuizPlayer() {
  const { id } = useParams()
  const [quiz] = useState<Quiz>(mockQuiz)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60) // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const currentQuestion = quiz.questions[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitted(true)
    setShowReview(true)
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const getQuestionTypeLabel = (type: QuizQuestion['type']) => {
    switch (type) {
      case 'multiple-choice':
        return '객관식'
      case 'true-false':
        return '참/거짓'
      case 'short-answer':
        return '주관식'
      default:
        return '문제'
    }
  }

  const isTimeWarning = timeLeft < 300 // 5 minutes warning

  if (showReview) {
    return (
      <QuizReviewModal
        quiz={quiz}
        answers={answers}
        score={calculateScore()}
        onClose={() => setShowReview(false)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-page py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600">{quiz.courseTitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center px-4 py-2 rounded-lg ${
                isTimeWarning ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <Clock className="h-4 w-4 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
              
              {/* Progress */}
              <div className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {quiz.questions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Time Warning */}
        {isTimeWarning && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">
                시간이 부족합니다! 서둘러 답안을 제출하세요.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getQuestionTypeLabel(currentQuestion.type)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {currentQuestion.points}점
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    문제 {currentQuestionIndex + 1}
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h2>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                      currentQuestion.options.map((option, index) => (
                        <label
                          key={index}
                          className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value={index}
                            checked={answers[currentQuestion.id] === index}
                            onChange={() => handleAnswerChange(currentQuestion.id, index)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-900">{option}</span>
                        </label>
                      ))
                    )}

                    {currentQuestion.type === 'true-false' && (
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value="true"
                            checked={answers[currentQuestion.id] === true}
                            onChange={() => handleAnswerChange(currentQuestion.id, true)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-900">참</span>
                        </label>
                        <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name={`question-${currentQuestion.id}`}
                            value="false"
                            checked={answers[currentQuestion.id] === false}
                            onChange={() => handleAnswerChange(currentQuestion.id, false)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-900">거짓</span>
                        </label>
                      </div>
                    )}

                    {currentQuestion.type === 'short-answer' && (
                      <textarea
                        value={answers[currentQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="답안을 입력하세요..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    이전
                  </Button>

                  <div className="flex space-x-2">
                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                      <Button
                        onClick={() => setShowConfirmModal(true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        제출하기
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>
                        다음
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">퀴즈 정보</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">제한 시간</p>
                    <p className="text-sm text-gray-900">{quiz.timeLimit}분</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 문제</p>
                    <p className="text-sm text-gray-900">{quiz.questions.length}문제</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">총 점수</p>
                    <p className="text-sm text-gray-900">{quiz.totalPoints}점</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Question Navigation */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">문제 목록</h3>
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-blue-600 text-white'
                          : answers[quiz.questions[index].id] !== undefined
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
                    <span>답변 완료</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
                    <span>미답변</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">퀴즈 제출 확인</h3>
              <p className="text-gray-600 mb-6">
                정말로 퀴즈를 제출하시겠습니까? 제출 후에는 답안을 수정할 수 없습니다.
              </p>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  제출하기
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}










