import { HttpException, HttpStatus } from '@nestjs/common';

export class NoContentException extends HttpException {
  constructor() {
    super('No content', HttpStatus.NO_CONTENT);
  }
}
