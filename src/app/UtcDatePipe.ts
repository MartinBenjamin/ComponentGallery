import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Patterns } from './Patterns';
import { DatePatterns, DatePatternsToken } from './DatePatterns';

@Pipe(
{
    name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform
{
    private _formatUTCDate: (date: Date) => string;

    constructor(
        @Inject(DatePatternsToken)
        patterns: Patterns
        )
    {
        this._formatUTCDate = formatUTCDate(patterns.Output);
    }

    transform(
        date: Date
        ): string
    {
        return this._formatUTCDate(date);
    }
}
 