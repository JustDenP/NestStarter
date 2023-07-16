import { _Controller } from '@modules/auth/decorators/auth-controller.decorator';
import { Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';

import { ServiceHealthIndicator } from './health-indicators/service.indicator';

@_Controller('health', false)
export class HealthCheckerController {
  constructor(
    private http: HttpHealthIndicator,
    private healthCheckService: HealthCheckService,
    private ormIndicator: MikroOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
    private serviceIndicator: ServiceHealthIndicator,
  ) {}

  @Get()
  @ApiOperation({ summary: "Get system's health" })
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1000 }),
      // the process should not use more than 300MB memory
      () => this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () => this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      () =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 30,
          path: '/',
        }),
    ]);
  }
}
