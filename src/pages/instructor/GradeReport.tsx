import { useState } from 'react'
import { FileText, Download, Filter, Users, Award, TrendingUp } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import CoursePageLayout from '../../components/instructor/CoursePageLayout'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'

export default function GradeReport() {
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  // Mock data
  const students = [
    {
      id: 1,
      name: '김학생',
      email: 'student1@example.com',
      totalScore: 256.5,
      average: 85.5,
      grade: 'A',
      totalExams: 3,
      completedExams: 3,
      rank: 1
    },
    {
      id: 2,
      name: '이학생',
      email: 'student2@example.com',
      totalScore: 246.9,
      average: 82.3,
      grade: 'B+',
      totalExams: 3,
      completedExams: 3,
      rank: 2
    },
    {
      id: 3,
      name: '박학생',
      email: 'student3@example.com',
      totalScore: 236.7,
      average: 78.9,
      grade: 'B',
      totalExams: 3,
      completedExams: 2,
      rank: 3
    }
  ]

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.text('성적 보고서', 20, 30)
    doc.text(`생성일: ${new Date().toLocaleDateString('ko-KR')}`, 20, 45)
    
    let yPosition = 60
    doc.text('학생 성적', 20, yPosition)
    yPosition += 10
    
    students.forEach((student, index) => {
      doc.text(`${index + 1}. ${student.name} - ${student.average}점 (${student.grade})`, 20, yPosition)
      yPosition += 10
    })
    
    doc.save('성적보고서.pdf')
  }

  const downloadExcel = () => {
    const data = students.map(student => ({
      '이름': student.name,
      '이메일': student.email,
      '총점': student.totalScore,
      '평균': student.average,
      '등급': student.grade
    }))
    
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '성적보고서')
    XLSX.writeFile(wb, '성적보고서.xlsx')
  }

  const rightActions = (
    <>
      <Button variant="outline" className="text-base-content/70 rounded-xl" onClick={downloadPDF}>
        <FileText className="h-4 w-4 mr-1" />
        PDF 다운로드
      </Button>
      <Button variant="outline" className="text-base-content/70 rounded-xl" onClick={downloadExcel}>
        <Download className="h-4 w-4 mr-1" />
        Excel 다운로드
      </Button>
    </>
  )

  return (
    <CoursePageLayout 
      currentPageTitle="성적 보고서 만들기"
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
              <p className="text-sm text-base-content/70">총 학생 수</p>
              <p className="text-2xl font-bold text-base-content">{students.length}</p>
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
              <p className="text-2xl font-bold text-base-content">
                {(students.reduce((acc, s) => acc + s.average, 0) / students.length).toFixed(1)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-warning" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">완료율</p>
              <p className="text-2xl font-bold text-base-content">
                {Math.round((students.reduce((acc, s) => acc + s.completedExams, 0) / (students.length * 3)) * 100)}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-info/10 rounded-lg">
              <FileText className="h-6 w-6 text-info" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-base-content/70">총 시험</p>
              <p className="text-2xl font-bold text-base-content">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* 성적 테이블 */}
      <Card>
        <div className="px-3 py-2 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-base-content">학생 성적</h2>
          <div className="flex space-x-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-base-300 rounded-lg px-3 py-1 bg-base-100 text-base-content"
            >
              <option value="all">전체</option>
              <option value="week">최근 1주</option>
              <option value="month">최근 1개월</option>
            </select>
          </div>
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
                  총점
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  평균
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  등급
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                  완료 시험
                </th>
              </tr>
            </thead>
            <tbody className="bg-base-100 divide-y divide-base-300">
              {students.map((student) => (
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
                    <div className="text-sm text-base-content/70">{student.totalScore}점</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{student.average}점</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.grade === 'A' ? 'bg-success/10 text-success' :
                      student.grade === 'B+' ? 'bg-primary/10 text-primary' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-base-content/70">{student.completedExams}/{student.totalExams}</div>
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








