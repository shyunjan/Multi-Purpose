import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { HelperService } from './helper.service';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';

@Controller('helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  // @EventPattern({ event: 'notice' })
  @EventPattern('notice')
  async notify(@Payload() data: Record<string, unknown>) {
    // console.info('Got an event. The event type =', this.notify.name, arguments.callee.name);
    console.info('Got an event. The event type =', 'notice');
    console.info('data =', data);
  }

  @MessagePattern('createHelper')
  create(@Payload() createHelperDto: CreateHelperDto) {
    return this.helperService.create(createHelperDto);
  }

  @MessagePattern('findAllHelper')
  findAll() {
    return this.helperService.findAll();
  }

  @MessagePattern('findOneHelper')
  findOne(@Payload() id: number) {
    return this.helperService.findOne(id);
  }

  @MessagePattern('updateHelper')
  update(@Payload() updateHelperDto: UpdateHelperDto) {
    return this.helperService.update(updateHelperDto.id, updateHelperDto);
  }

  @MessagePattern('removeHelper')
  remove(@Payload() id: number) {
    return this.helperService.remove(id);
  }
}
