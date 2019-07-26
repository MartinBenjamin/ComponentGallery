import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePatterns, DatePatternsToken } from './DatePatterns';
import { DateConversionService } from './DateConversionService';
import { DateModel } from './DateModel';
import { UtcDatePipe } from './UtcDatePipe';
import { Calendar } from './Calendar';

@NgModule(
    {
        imports:
        [
            CommonModule
        ],
        declarations:
        [
            DateModel,
            Calendar,
            UtcDatePipe
        ],
        exports:
        [
            DateModel,
            Calendar,
            UtcDatePipe
        ],
        providers:
        [
            DateConversionService,
            {
                provide: DatePatternsToken,
                useValue: DatePatterns
            }
        ]
    })
export class DateModule
{ }
