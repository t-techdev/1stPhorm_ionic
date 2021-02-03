import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertLengthPipe } from './pipes/convert-length/convert-length.pipe';
import { ConvertWeightPipe } from './pipes/convert-weight/convert-weight.pipe';

@NgModule({
  declarations: [ConvertLengthPipe, ConvertWeightPipe],
  imports: [
    CommonModule
  ],
  exports: [ConvertLengthPipe, ConvertWeightPipe]
})
export class ConvertUnitModule { }
