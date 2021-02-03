import { Component, Input, OnInit } from '@angular/core';
import { MessagePartComponent, TextType } from '../../../../interfaces/messages';

@Component({
  selector: 'app-message-part-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements MessagePartComponent, OnInit {

  @Input() part: TextType;

  constructor() { }

  ngOnInit() {}

}
