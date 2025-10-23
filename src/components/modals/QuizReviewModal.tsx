import { CheckCircle, XCircle, Clock, Award } from 'lucide-react'
import ModalBase from './ModalBase'
import type { Quiz, QuizQuestion } from '../../types'

interface QuizReviewModalProps {
  quiz: Quiz
  answers: Record<string, any>
  score: number
  onClose: () => void
}

export default function QuizReviewModal({ quiz, answers, score, onClose }: QuizReviewModalProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  const isCorrect = (question: QuizQuestion) => {
    return answers[question.id] === question.correctAnswer
  }

  const getAnswerText = (question: QuizQuestion, answer: any) => {
    if (question.type === 'multiple-choice' && question.options) {
      return question.options[answer] || '답변 없음'
    }
    if (question.type === 'true-false') {
      return answer ? '참' : '거짓'
    }
    return answer || '답변 없음'
  }

  const getCorrectAnswerText = (question: QuizQuestion) => {
    if (question.type === 'multiple-choice' && question.options) {
      return question.options[question.correctAnswer as number]
    }
    if (question.type === 'true-false') {
      return question.correctAnswer ? '참' : '거짓'
    }
    return question.correctAnswer
  }

  const correctAnswers = quiz.questions.filter(isCorrect).length
  const totalQuestions = quiz.questions.length

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">퀴즈 결과</h2>
              <p className="text-sm text-gray-500">{quiz.title}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg ${getScoreColor(score)}`}>
              <div className="text-center">
                <div className="text-2xl font-bold">{score}%</div>
                <div className="text-sm">등급: {getScoreGrade(score)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">정답</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">오답</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalQuestions - correctAnswers}</div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-5 w-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">총 문제</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
            </div>
          </div>

          {/* Question Review */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">문제별 정답 확인</h3>
            
            {quiz.questions.map((question, index) => {
              const isCorrectAnswer = isCorrect(question)
              const userAnswer = answers[question.id]
              
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      문제 {index + 1}: {question.question}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {isCorrectAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-gray-600">
                        {question.points}점
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 w-16">내 답:</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        isCorrectAnswer 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {getAnswerText(question, userAnswer)}
                      </span>
                    </div>
                    
                    {!isCorrectAnswer && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 w-16">정답:</span>
                        <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                          {getCorrectAnswerText(question)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </ModalBase>
  )
}








