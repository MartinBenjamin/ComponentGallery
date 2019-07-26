import { Pipe } from '@angular/core';
import { NumberPipe } from './NumberPipe';
import { AmountConversionService } from './AmountConversionService';

@Pipe(
    {
        name: 'amount'
    })
export class AmountPipe extends NumberPipe
{
    constructor(
        amountConversionService: AmountConversionService
        )
    {
        super(amountConversionService);
    }
}
