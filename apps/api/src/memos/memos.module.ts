import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemosController } from './memos.controller';
import { MemosService } from './memos.service';
import { Memo } from './entities/memo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Memo])],
  controllers: [MemosController],
  providers: [MemosService],
  exports: [MemosService],
})
export class MemosModule {}









