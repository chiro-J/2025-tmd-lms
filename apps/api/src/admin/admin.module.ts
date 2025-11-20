import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SubAdmin } from './entities/sub-admin.entity';
import { Instructor } from './entities/instructor.entity';
import { Student } from './entities/student.entity';
import { Notice } from './entities/notice.entity';
import { FAQ } from '../faq/entities/faq.entity';
import { Inquiry } from './entities/inquiry.entity';
import { SystemSettings } from './entities/system-settings.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubAdmin,
      Instructor,
      Student,
      Notice,
      FAQ,
      Inquiry,
      SystemSettings,
      User,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}

