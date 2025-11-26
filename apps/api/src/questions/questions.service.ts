import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Exam } from '../exams/entities/exam.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
  ) {}

  async findAll(courseId?: number): Promise<any[]> {
    let questions: Question[];

    if (courseId) {
      // courseId가 있는 경우: 해당 강좌의 시험에 연결된 문제만 조회
      // exam이 null이 아닌 경우만 조회하기 위해 innerJoin 사용
      questions = await this.questionRepository
        .createQueryBuilder('question')
        .innerJoin('question.exam', 'exam', 'exam.courseId = :courseId', { courseId })
        .orderBy('question.createdAt', 'DESC')
        .getMany();
    } else {
      // courseId가 없는 경우: 모든 문제 조회 (exam이 없는 문제도 포함)
      questions = await this.questionRepository
        .createQueryBuilder('question')
        .leftJoinAndSelect('question.exam', 'exam')
        .orderBy('question.createdAt', 'DESC')
        .getMany();
    }

    // 프론트엔드 타입에 맞게 변환
    return questions.map(q => ({
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
      examId: q.examId,
    }));
  }

  async findOne(id: number): Promise<any> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['exam'],
    });

    if (!question) {
      throw new NotFoundException(`문제를 찾을 수 없습니다. ID: ${id}`);
    }

    // 프론트엔드 타입에 맞게 변환
    return {
      id: question.id,
      type: question.type,
      question: question.question,
      options: question.options || [],
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation || '',
      status: question.status,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      examId: question.examId,
    };
  }

  async create(questionData: Partial<Question>): Promise<any> {
    // examId가 필수인지 확인
    if (!questionData.examId) {
      throw new Error('시험 ID(examId)는 필수입니다. 문제는 반드시 시험에 연결되어야 합니다.');
    }
    const question = this.questionRepository.create(questionData);
    const saved = await this.questionRepository.save(question);

    // 프론트엔드 타입에 맞게 변환
    return {
      id: saved.id,
      type: saved.type,
      question: saved.question,
      options: saved.options || [],
      correctAnswer: saved.correctAnswer,
      points: saved.points,
      explanation: saved.explanation || '',
      status: saved.status,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      examId: saved.examId,
    };
  }

  async update(id: number, questionData: Partial<Question>): Promise<any> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`문제를 찾을 수 없습니다. ID: ${id}`);
    }

    Object.assign(question, questionData);
    const updated = await this.questionRepository.save(question);

    // 프론트엔드 타입에 맞게 변환
    return {
      id: updated.id,
      type: updated.type,
      question: updated.question,
      options: updated.options || [],
      correctAnswer: updated.correctAnswer,
      points: updated.points,
      explanation: updated.explanation || '',
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      examId: updated.examId,
    };
  }

  async remove(id: number): Promise<void> {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`문제를 찾을 수 없습니다. ID: ${id}`);
    }
    await this.questionRepository.remove(question);
  }

  async getExamsInfo(courseId: number): Promise<Record<string, { id: string; title: string; type: string }>> {
    const exams = await this.examRepository.find({
      where: { courseId },
      select: ['id', 'title', 'type'],
    });

    return exams.reduce((acc, exam) => {
      acc[exam.id.toString()] = {
        id: exam.id.toString(),
        title: exam.title,
        type: exam.type,
      };
      return acc;
    }, {} as Record<string, { id: string; title: string; type: string }>);
  }
}
