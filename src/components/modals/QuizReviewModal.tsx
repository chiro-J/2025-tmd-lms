import { CheckCircle, XCircle, Award } from 'lucide-react'
import ModalBase from './ModalBase'
import type { Quiz, QuizQuestion } from '../../types'

interface QuizReviewModalProps {
  quiz: Quiz
  userAnswers: { [questionId: string]: string }
  onClose: () => void
}

export default function QuizReviewModal({ quiz, userAnswers, onClose }: QuizReviewModalProps) {
  const isCorrect = (question: QuizQuestion) => {
    const userAnswer = userAnswers[question.id]
    return userAnswer === question.correctAnswer
  }

  const score = Math.round(
    (quiz.questions.filter(isCorrect).length / quiz.questions.length) * 100
  )

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  const correctAnswers = quiz.questions.filter(isCorrect).length
  const totalQuestions = quiz.questions.length

  return (
    <ModalBase 
      open={true}
      onClose={onClose}
      title="퀴즈 결과"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">{quiz.title}</div>
          <div className={`px-4 py-2 rounded-lg ${getScoreColor(score)}`}>
            <div className="text-center">
              <div className="text-2xl font-bold">{score}%</div>
              <div className="text-sm">등급: {getScoreGrade(score)}</div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">정답</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">오답</span>
            </div>
            <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">총 문제</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
          </div>
        </div>

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">문제별 정답 확인</h3>
          {quiz.questions.map((question, index) => {
            const userAnswer = userAnswers[question.id]
            const isCorrectAnswer = isCorrect(question)
            
            return (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="flex items-center">
                    {isCorrectAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => {
                    const isUserAnswer = userAnswer === option
                    const isCorrectOption = option === question.correctAnswer
                    
                    let className = "p-3 rounded-lg text-sm border "
                    
                    if (isCorrectOption) {
                      className += "bg-green-50 border-green-200 text-green-800"
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      className += "bg-red-50 border-red-200 text-red-800"
                    } else {
                      className += "bg-gray-50 border-gray-200 text-gray-700"
                    }
                    
                    return (
                      <div key={optionIndex} className={className}>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span>{option}</span>
                          {isCorrectOption && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-2" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <XCircle className="h-4 w-4 text-red-600 ml-2" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                
                {!isCorrectAnswer && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>정답:</strong> {question.correctAnswer}
                    </p>
                    {question.explanation && (
                      <p className="text-sm text-yellow-700 mt-1">
                        <strong>해설:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
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