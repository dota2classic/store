import { HttpException, HttpStatus } from '@nestjs/common';

export class NoBalanceException extends HttpException {
  constructor() {
    super('Not enough money', HttpStatus.CONFLICT);
  }
}
