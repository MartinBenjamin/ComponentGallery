import { Inject, Injectable } from '@angular/core';
import { NumberConversionService } from './NumberConversionService';
import { NumberInputDefinition } from './NumberInputDefinition';
import { AmountInputDefinitionToken } from './AmountInputDefinition';

@Injectable()
export class AmountConversionService extends NumberConversionService
{
    constructor(
        @Inject(AmountInputDefinitionToken)
        numberInputDefinition: NumberInputDefinition
        )
    {
        super(numberInputDefinition);
    }
}