import { useState } from 'react'
import { Star, Filter, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function ReviewManagement() {
  const [filter, setFilter] = useState('all')

  // Mock data
  const reviews = [
    {
      id: 1,
      studentName: '김학생',
      rating: 5,
      comment: '정말 유익한 강의였습니다. 실무에 바로 적용할 수 있는 내용들이 많아서 좋았어요.',
      date: '2024-10-20',
      likes: 12,
      dislikes: 0,
      status: 'approved'
    },
    {
      id: 2,
      studentName: '이학생',
      rating: 4,
      comment: '강의 내용은 좋았는데, 속도가 조금 빨랐던 것 같습니다.',
      date: '2024-10-19',
      likes: 8,
      dislikes: 1,
      status: 'pending'
    },
    {
      id: 3,
      studentName: '박학생',
      rating: 5,
      comment: '강사님이 설명을 정말 잘해주셔서 이해하기 쉬웠습니다. 추천합니다!',
      date: '2024-10-18',
      likes: 15,
      dislikes: 0,
      status: 'approved'
    }
  ]

  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Filter className="h-4 w-4 mr-1" />
        필터
      </Button>
    </>
  )

  return (
    <CoursePageLayout 
      currentPageTitle="후기 관리"
      rightActions={rightActions}
    >
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">총 후기</p>
              <p className="text-2xl font-bold text-base-content">{reviews.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success/10 rounded-lg">
              <Star className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">평균 평점</p>
              <p className="text-2xl font-bold text-base-content">
                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning/10 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">총 좋아요</p>
              <p className="text-2xl font-bold text-base-content">
                {reviews.reduce((acc, r) => acc + r.likes, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* 후기 목록 */}
      <Card>
        <div className="px-3 py-2 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-base-content">후기 목록</h2>
          <div className="flex space-x-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-base-300 rounded-lg px-3 py-1 bg-base-100 text-base-content"
            >
              <option value="all">전체</option>
              <option value="approved">승인됨</option>
              <option value="pending">대기중</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-base-300">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 hover:bg-base-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex-shrink-0 h-8 w-8">
                      <div className="h-8 w-8 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium text-base-content">
                        {review.studentName.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-base-content">{review.studentName}</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-warning fill-current' : 'text-base-content/30'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-base-content/70">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-base-content/80 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4 text-success" />
                      <span className="text-sm text-base-content/70">{review.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown className="h-4 w-4 text-error" />
                      <span className="text-sm text-base-content/70">{review.dislikes}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    review.status === 'approved' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {review.status === 'approved' ? '승인됨' : '대기중'}
                  </span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="text-success">
                      승인
                    </Button>
                    <Button size="sm" variant="outline" className="text-error">
                      거부
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </CoursePageLayout>
  )
}





