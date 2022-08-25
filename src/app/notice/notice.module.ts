import { Module } from '@nestjs/common';
import CommonModule from '../common/common.module';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';

@Module({
  imports: [CommonModule],
  controllers: [NoticeController],
  providers: [NoticeService],
})
export default class NoticeModule {}
