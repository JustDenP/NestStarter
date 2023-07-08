import { Injectable } from '@nestjs/common';
import { HealthIndicator } from '@nestjs/terminus';

@Injectable()
export class ServiceHealthIndicator extends HealthIndicator {}
