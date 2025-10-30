import { useState } from 'react'
import { BarChart3, Download, Filter, TrendingUp, Users, Award, Target } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'

export default function ResultsAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  // Mock data
  const examResults = [
    {
      id: 1,
      title: '중간고사',
      totalStudents: 25,
      averageScore: 78.5,
      passRate: 84,
      completionRate: 100,
      date: '2024-10-20'
    },
    {
      id: 2,
      title: '과제 1',
      totalStudents: 25,
      averageScore: 85.2,
      passRate: 92,
      completionRate: 96,
      date: '2024-10-10'
    },
    {
      id: 3,
      title: '퀴즈 1',
      totalStudents: 25,
      averageScore: 72.1,
      passRate: 76,
      completionRate: 100,
      date: '2024-10-05'
    }
  ]

  const studentPerformance = [
    {
      id: 1,
      name: '김학생',
      email: 'student1@example.com',
      averageScore: 85.5,
      totalExams: 3,
      completedExams: 3,
      rank: 1
    },
    {
      id: 2,
      name: '이학생',
      email: 'student2@example.com',
      averageScore: 82.3,
      totalExams: 3,
      completedExams: 3,
      rank: 2
    },
    {
      id: 3,
      name: '박학생',
      email: 'student3@example.com',
      averageScore: 78.9,
      totalExams: 3,
      completedExams: 2,
      rank: 3
    }
  ]

  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Filter className="h-4 w-4 mr-1" />
        필터
      </Button>
      <Button variant="outline" className="text-base-content/70 rounded-xl">
        <Download className="h-4 w-4 mr-1" />
        보고서 다운로드
      </Button>
    </>
  )

  return (
    <CoursePageLayout
      currentPageTitle="결과 분석"
      rightActions={rightActions}
    >
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">총 수강생</p>
              <p className="text-2xl font-bold text-base-content">25</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success/10 rounded-lg">
              <Award className="h-6 w-6 text-success" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">평균 점수</p>
              <p className="text-2xl font-bold text-base-content">78.5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Target className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">통과율</p>
              <p className="text-2xl font-bold text-base-content">84%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-info/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">완료율</p>
              <p className="text-2xl font-bold text-base-content">98%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 시험 결과 테이블 */}
      <Card className="mb-6">
        <div className="px-3 py-2 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-base-content">시험 결과</h2>
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-base-300 rounded-lg px-3 py-1 bg-base-100 text-base-content"
            >
              <option value="week">최근 1주</option>
              <option value="month">최근 1개월</option>
              <option value="all">전체</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  시험명
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  수강생 수
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  평균 점수
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  통과율
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  완료율
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  날짜
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-300">
              {examResults.map((exam) => (
                <tr key={exam.id} className="hover:bg-base-200">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-base-content">{exam.title}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{exam.totalStudents}명</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{exam.averageScore}점</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{exam.passRate}%</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{exam.completionRate}%</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{exam.date}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 학생 성과 테이블 */}
      <Card>
        <div className="px-3 py-2 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-base-content">학생 성과</h2>
          <span className="text-sm text-base-content/70">{studentPerformance.length}명</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-base-300">
            <thead className="bg-base-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  순위
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  학생
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  평균 점수
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  완료 시험
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  진행률
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-300">
              {studentPerformance.map((student) => (
                <tr key={student.id} className="hover:bg-base-200">
                  <td className="pl-4 pr-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-base-content">#{student.rank}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-base-300 flex items-center justify-center text-sm font-medium text-base-content">
                          {student.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-base-content">{student.name}</div>
                        <div className="text-sm text-base-content/70">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{student.averageScore}점</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{student.completedExams}/{student.totalExams}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-base-300 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(student.completedExams / student.totalExams) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-base-content/70">
                        {Math.round((student.completedExams / student.totalExams) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </CoursePageLayout>
  )
}















