import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { ExamSubmission } from './entities/exam-submission.entity';
import { Question } from '../questions/entities/question.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(ExamSubmission)
    private examSubmissionRepository: Repository<ExamSubmission>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async findAllByCourse(courseId: number): Promise<any[]> {
    const exams = await this.examRepository.find({
      where: { courseId },
      relations: ['author', 'questions'],
      order: { startDate: 'DESC' },
    });

    // 각 시험의 통계 계산 (프론트엔드 타입에 맞게 변환)
    return exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      type: exam.type,
      status: this.calculateStatus(exam.startDate, exam.endDate),
      startDate: exam.startDate,
      endDate: exam.endDate,
      participants: exam.participants,
      totalQuestions: exam.questions?.length || 0,
      author: exam.author?.name || '미지정',
      group: exam.group || '전체',
      timeLimit: exam.timeLimit,
    }));
  }

  async findOne(id: number): Promise<any> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['author', 'questions', 'course'],
    });

    if (!exam) {
      throw new NotFoundException(`시험을 찾을 수 없습니다. ID: ${id}`);
    }

    // 프론트엔드 타입에 맞게 변환
    return {
      id: exam.id,
      title: exam.title,
      type: exam.type,
      status: this.calculateStatus(exam.startDate, exam.endDate),
      startDate: exam.startDate,
      endDate: exam.endDate,
      participants: exam.participants,
      totalQuestions: exam.questions?.length || 0,
      author: exam.author?.name || '미지정',
      group: exam.group || '전체',
      timeLimit: exam.timeLimit,
      courseId: exam.courseId,
      questions: exam.questions?.map(q => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points,
        explanation: q.explanation || '',
        status: q.status,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })) || [],
    };
  }

  async create(courseId: number, examData: Partial<Exam>): Promise<any> {
    const exam = this.examRepository.create({
      ...examData,
      courseId,
    });

    const savedExam = await this.examRepository.save(exam);

    // 프론트엔드 타입에 맞게 변환
    return {
      id: savedExam.id,
      title: savedExam.title,
      type: savedExam.type,
      status: this.calculateStatus(savedExam.startDate, savedExam.endDate),
      startDate: savedExam.startDate,
      endDate: savedExam.endDate,
      participants: savedExam.participants,
      totalQuestions: 0,
      author: savedExam.author?.name || '미지정',
      group: savedExam.group || '전체',
      timeLimit: savedExam.timeLimit,
    };
  }

  async update(id: number, examData: Partial<Exam>): Promise<any> {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['author', 'questions'],
    });

    if (!exam) {
      throw new NotFoundException(`시험을 찾을 수 없습니다. ID: ${id}`);
    }

    Object.assign(exam, examData);
    const updatedExam = await this.examRepository.save(exam);

    // 프론트엔드 타입에 맞게 변환
    return {
      id: updatedExam.id,
      title: updatedExam.title,
      type: updatedExam.type,
      status: this.calculateStatus(updatedExam.startDate, updatedExam.endDate),
      startDate: updatedExam.startDate,
      endDate: updatedExam.endDate,
      participants: updatedExam.participants,
      totalQuestions: updatedExam.questions?.length || 0,
      author: updatedExam.author?.name || '미지정',
      group: updatedExam.group || '전체',
      timeLimit: updatedExam.timeLimit,
    };
  }

  async remove(id: number): Promise<void> {
    const exam = await this.examRepository.findOne({
      where: { id },
    });

    if (!exam) {
      throw new NotFoundException(`시험을 찾을 수 없습니다. ID: ${id}`);
    }

    await this.examRepository.remove(exam);
  }

  async submitExam(
    examId: number,
    userId: number,
    answers: Record<string, any>,
    timeSpent: number,
  ): Promise<any> {
    const exam = await this.examRepository.findOne({
      where: { id: examId },
      relations: ['questions'],
    });

    if (!exam) {
      throw new NotFoundException(`시험을 찾을 수 없습니다. ID: ${examId}`);
    }

    // 점수 계산
    let score = 0;
    let totalPoints = 0;
    if (exam.questions) {
      exam.questions.forEach(question => {
        totalPoints += question.points;
        const userAnswer = answers[question.id.toString()];
        if (userAnswer !== undefined && userAnswer !== null) {
          // 정답 비교 (타입에 따라 다르게 처리)
          if (question.type === 'multiple-choice') {
            if (userAnswer === question.correctAnswer) {
              score += question.points;
            }
          } else if (question.type === 'true-false') {
            if (userAnswer === question.correctAnswer) {
              score += question.points;
            }
          } else if (question.type === 'short-answer') {
            // 주관식은 정확히 일치하는 경우만 점수 부여 (향후 개선 가능)
            if (String(userAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase()) {
              score += question.points;
            }
          }
        }
      });
    }

    // 기존 제출물 확인
    const existingSubmission = await this.examSubmissionRepository.findOne({
      where: { examId, userId },
    });

    const submissionData = {
      examId,
      userId,
      answers,
      score,
      totalPoints,
      submittedAt: new Date(),
      timeSpent,
    };

    let submission: ExamSubmission;
    if (existingSubmission) {
      Object.assign(existingSubmission, submissionData);
      submission = await this.examSubmissionRepository.save(existingSubmission);
    } else {
      submission = this.examSubmissionRepository.create(submissionData);
      submission = await this.examSubmissionRepository.save(submission);
    }

    return {
      id: submission.id,
      examId: submission.examId,
      userId: submission.userId,
      answers: submission.answers,
      score: submission.score,
      totalPoints: submission.totalPoints,
      submittedAt: submission.submittedAt,
      timeSpent: submission.timeSpent,
    };
  }

  async getMySubmission(examId: number, userId: number): Promise<any | null> {
    const submission = await this.examSubmissionRepository.findOne({
      where: { examId, userId },
      relations: ['exam', 'user'],
    });

    if (!submission) {
      return null;
    }

    return {
      id: submission.id,
      examId: submission.examId,
      userId: submission.userId,
      answers: submission.answers,
      score: submission.score,
      totalPoints: submission.totalPoints,
      submittedAt: submission.submittedAt,
      timeSpent: submission.timeSpent,
    };
  }

  private calculateStatus(startDate: string, endDate: string): string {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return '예정';
    if (now >= start && now <= end) return '진행중';
    return '완료';
  }
}

