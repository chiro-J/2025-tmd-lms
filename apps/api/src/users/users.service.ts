import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      console.error('findOne error:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // 로그인에 필요한 필드만 선택 (DB에 없는 컬럼 제외)
      // bio, address, github_url, notion_url, job, language는 DB에 없을 수 있으므로 제외
      const user = await this.usersRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.username',
          'user.email',
          'user.password',
          'user.role',
          'user.name',
          'user.phone',
          'user.createdAt',
          'user.updatedAt'
        ])
        .where('user.email = :email', { email })
        .getOne();
      return user;
    } catch (error) {
      console.error('findByEmail error:', error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const count = await this.usersRepository.count({ where: { email } });
      return count > 0;
    } catch (error) {
      console.error('checkEmailExists error:', error);
      throw error;
    }
  }

  async checkPhoneExists(phone: string): Promise<boolean> {
    if (!phone) return false;
    const user = await this.findByPhone(phone);
    return user !== null;
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // 프로필 조회 (JSONB 데이터 포함)
  async getProfile(userId: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // profile JSONB 파싱
      let profileData: any = {};
      if (user.profile) {
        try {
          profileData = typeof user.profile === 'string' ? JSON.parse(user.profile) : user.profile;
        } catch (e) {
          console.error('Profile JSON parse error:', e);
        }
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone || '',
        bio: user.bio || '',
        address: user.address || '',
        githubUrl: user.githubUrl || '',
        notionUrl: user.notionUrl || '',
        job: user.job || '',
        language: user.language || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // 프로필 JSONB 데이터
        resumeEmail: profileData.resumeEmail || user.email,
        resumeBio: profileData.resumeBio || user.bio || '',
        desiredPosition: profileData.desiredPosition || '',
        resumePhoto: profileData.resumePhoto || '',
        profileImage: profileData.profileImage || '',
        education: profileData.education || [],
        experience: profileData.experience || [],
        projects: profileData.projects || [],
        certificates: profileData.certificates || [],
        languageSkills: profileData.languageSkills || [],
        trainings: profileData.trainings || [],
        skills: profileData.skills || [],
        languages: profileData.languages || [],
        portfolioUrl: profileData.portfolioUrl || '',
        resumeTemplate: profileData.resumeTemplate || 'modern',
        googleLinked: profileData.googleLinked || false,
        kakaoLinked: profileData.kakaoLinked || false,
        googleLinkedDate: profileData.googleLinkedDate || '',
        kakaoLinkedDate: profileData.kakaoLinkedDate || '',
      };
    } catch (error) {
      console.error('getProfile error:', error);
      throw error;
    }
  }

  // 프로필 업데이트 (JSONB 데이터 저장)
  async updateProfile(userId: number, data: any): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }

      // users 테이블의 기본 필드 업데이트
      const basicFields = ['name', 'phone', 'bio', 'address', 'githubUrl', 'notionUrl', 'job', 'language'];
      const updateData: any = {};

      basicFields.forEach(field => {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      });

      if (Object.keys(updateData).length > 0) {
        await this.usersRepository.update(userId, updateData);
      }

      // profile JSONB 필드 업데이트
      const profileFields = [
        'resumeEmail', 'resumeBio', 'desiredPosition', 'resumePhoto', 'profileImage',
        'education', 'experience', 'projects', 'certificates', 'languageSkills',
        'trainings', 'skills', 'languages', 'portfolioUrl', 'resumeTemplate',
        'googleLinked', 'kakaoLinked', 'googleLinkedDate', 'kakaoLinkedDate'
      ];

      const profileData: any = {};
      profileFields.forEach(field => {
        if (data[field] !== undefined) {
          profileData[field] = data[field];
        }
      });

      if (Object.keys(profileData).length > 0) {
        // 기존 profile 데이터 가져오기
        const existingUser = await this.usersRepository.findOne({ where: { id: userId } });
        let existingProfile: any = {};

        if (existingUser?.profile) {
          try {
            existingProfile = typeof existingUser.profile === 'string'
              ? JSON.parse(existingUser.profile)
              : existingUser.profile;
          } catch (e) {
            console.error('Existing profile parse error:', e);
          }
        }

        // 기존 데이터와 새 데이터 병합
        const mergedProfile = { ...existingProfile, ...profileData };

        // profile JSONB 업데이트
        await this.usersRepository.update(userId, { profile: mergedProfile as any });
      }

      // 업데이트된 프로필 반환
      return await this.getProfile(userId);
    } catch (error) {
      console.error('updateProfile error:', error);
      throw error;
    }
  }

}
