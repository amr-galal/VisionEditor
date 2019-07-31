import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ServiceService } from '../../service.service';
import * as workerTimers from 'worker-timers';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/theme/monokai';
import 'brace/mode/java';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('editor') editor;
  @ViewChild('EditorWrapper') EditorWrapper: ElementRef;

  mode = 'java';
//   text = `
//   public class BCIJava {
//     public static void main(String[] args) {
// \t\t
// \t\t
// \t\t
// \t\t
// \t\t
// \t\t
// \t\t
//     }
//   }
//   `;

  text = this.service.fileContent;

  options: any = {
    maxLines: 10000,
    printMargin: true,
    enableBasicAutocompletion: true,
    autoScrollEditorIntoView: true,
    enableLiveAutocompletion: true
  };

  boxSize = 0;
  writeData = false;

  upLeft = false;
  upRight = false;
  upMiddle = false;
  downLeft = false;
  downRight = false;

  upLeftText = '';
  upMiddleText = '';
  upRightText = '';
  downLeftText = '';
  downRightText = '';
  dic = {};
  blank = {Text: 'Blank', Value: '', Type: 4};
  Back = {Text: 'Back', Value: 'Back', Type: 3};
  root = 'root';
  stack = [];

  height;
  showTest = true;
  showWait = false;

  secondsCount = 1;
  Blocks = 0;
  showNum = true;

  textarea = null;
  startPos = null;
  endPos = null;

  send = '0';
  time = 5;
  timeTrain = 5;
  SecondsRem = 0;
  startBtn = true;

  listFiles = '';
  fileData = '';
  test = [[], [], [], [], []];
  testt = [{}, {}, {}, {}, {}];
  Testing;

  continueFlag = false;

  public constructor(private socket: Socket, private service: ServiceService) {
    
    //  types --> 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 -->
    // 0: another this.dic, 1: keyboard key, 2: text, 3: this.back, 4: this.Blank
    // 5: function, 6: flowchart,
    // 7: = flowchart, 9: end flowchart
    // 10: flowchart press enter
    // {Text: 'Letters', Value: 'Letters', Type: 0}

  }

  ngOnInit() {
    // this.dictionaryUpdate();

    this.Testing = true; this.boxSize = 300;
    setTimeout(() => {
      this.runTest();
    }, 100);

    this.socket.on('saveFile', (socket) => {
      console.log('saveFile', socket);
      if ( socket['data'] !== 'done') {
        alert(socket['data']);
      }
      this.showWait = false;
    });

    this.socket.on('runCode', (socket) => {
      const code = this.text;
      this.text = socket['data'];
      this.showWait = true;
      setTimeout(() => {
        this.text = code;
        this.showWait = false;
      }, 10000);
    });
  }

  dictionaryUpdate() {
    this.dic[this.root] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: 'Arrows', Value: 'Arrows', Type: 0},
      {Text: 'Options', Value: 'Options', Type: 0}, {Text: 'Blocks', Value: 'Blocks', Type: 0},
      {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
    ];

    this.dic['Letters'] = [{Text: 'a-g', Value: 'a b c d e f g', Type: 0}, {Text: 'h-m', Value: 'h i j k l m', Type: 0}, this.Back,
      {Text: 'n-s', Value: 'n o p q r s', Type: 0}, {Text: 't-z', Value: 't u v w x y z', Type: 0}];

    this.dic['a-g'] = [{Text: 'a', Value: 'a', Type: 1}, {Text: 'b', Value: 'b', Type: 1}, this.Back,
      {Text: 'c', Value: 'c', Type: 1}, {Text: 'd-g', Value: 'd e f g', Type: 0}];

    this.dic['d-g'] = [{Text: 'd', Value: 'd', Type: 1}, {Text: 'e', Value: 'e', Type: 1}, this.Back,
      {Text: 'f', Value: 'f', Type: 1}, {Text: 'g', Value: 'g', Type: 1}];

    this.dic['h-m'] = [{Text: 'h', Value: 'h', Type: 1}, {Text: 'i', Value: 'i', Type: 1}, this.Back,
      {Text: 'j', Value: 'j', Type: 1}, {Text: 'k-m', Value: 'k l m', Type: 0}];

    this.dic['k-m'] = [{Text: 'k', Value: 'k', Type: 1}, {Text: 'l', Value: 'l', Type: 1}, this.Back,
      {Text: 'm', Value: 'm', Type: 1}, this.blank];

    this.dic['n-s'] = [{Text: 'n', Value: 'n', Type: 1}, {Text: 'o', Value: 'o', Type: 1}, this.Back,
      {Text: 'p', Value: 'p', Type: 1}, {Text: 'q-s', Value: 'q r s', Type: 0}];

    this.dic['q-s'] = [{Text: 'q', Value: 'q', Type: 1}, {Text: 'r', Value: 'r', Type: 1}, this.Back,
      {Text: 's', Value: 's', Type: 1}, this.blank];

    this.dic['t-z'] = [{Text: 't', Value: 't', Type: 1}, {Text: 'u', Value: 'u', Type: 1}, this.Back,
      {Text: 'v', Value: 'v', Type: 1}, {Text: 'w-z', Value: 'w x y z', Type: 0}];

    this.dic['w-z'] = [{Text: 'w', Value: 'w', Type: 1}, {Text: 'x', Value: 'x', Type: 1}, this.Back,
      {Text: 'y', Value: 'y', Type: 1}, {Text: 'z', Value: 'z', Type: 1}];

    // ##########################
    this.dic['Numbers, Operators, Characters'] = [{Text: '0-4', Value: '0 1 2 3 4', Type: 0}, {Text: '5-9', Value: '5 6 7 8 9', Type: 0},
      this.Back, {Text: 'Operators', Value: 'Operators', Type: 0}, {Text: 'Characters', Value: 'Characters', Type: 0}];

    this.dic['0-4'] = [{Text: '0', Value: '0', Type: 1}, {Text: '1', Value: '1', Type: 1}, this.Back,
      {Text: '2', Value: '2', Type: 1}, {Text: '3-4', Value: '3 4', Type: 0}];

    this.dic['3-4'] = [this.blank, {Text: '3', Value: '3', Type: 1}, this.Back,
      {Text: '4', Value: '4', Type: 1}, this.blank];

    this.dic['5-9'] = [{Text: '5', Value: '5', Type: 1}, {Text: '6', Value: '6', Type: 1}, this.Back,
      {Text: '7', Value: '7', Type: 1}, {Text: '8-9', Value: '8 9', Type: 0}];

    this.dic['8-9'] = [this.blank, {Text: '8', Value: '8', Type: 1}, this.Back,
      {Text: '9', Value: '9', Type: 1}, this.blank];

    this.dic['Operators'] = [{Text: 'Arithmetic', Value: 'Arithmetic', Type: 0}, {Text: 'Logical', Value: 'Logical', Type: 0},
      this.Back, {Text: 'Bitwise', Value: 'Bitwise', Type: 0},
      {Text: 'Relational and Assignment', Value: 'Relational and Assignment', Type: 0}];

    this.dic['Arithmetic'] = [{Text: '+', Value: '+', Type: 1}, {Text: '-', Value: '-', Type: 1}, this.Back,
      {Text: '*', Value: '*', Type: 1}, {Text: '/', Value: '/', Type: 1}];

    this.dic['Logical'] = [{Text: '&&', Value: '&&', Type: 1}, {Text: '||', Value: '||', Type: 1}, this.Back,
      {Text: '!', Value: '!', Type: 1}, {Text: '==', Value: '==', Type: 1}];

    this.dic['Bitwise'] = [{Text: '&', Value: '&', Type: 1}, {Text: '|', Value: '|', Type: 1}, this.Back,
      {Text: '^', Value: '^', Type: 1}, {Text: '~', Value: '~', Type: 1}];

    this.dic['Relational and Assignment'] = [{Text: '=', Value: '=', Type: 1}, {Text: '<', Value: '<', Type: 1}, this.Back,
      {Text: '>', Value: '>', Type: 1}, this.blank];

    this.dic['Characters'] = [{Text: 'enter', Value: 'enter', Type: 1}, {Text: 'delete', Value: 'delete', Type: 1}, this.Back,
      {Text: 'backspace', Value: 'backspace', Type: 1}, {Text: 'more-characters', Value: 'More', Type: 0}];

    this.dic['more-characters'] = [{Text: ';', Value: ';', Type: 0}, {Text: '.', Value: '.', Type: 0}, this.Back,
      {Text: '_', Value: '_', Type: 0}, {Text: 'tab', Value: 'tab', Type: 1}];

    this.dic['Arrows'] = [{Text: 'left', Value: 'left', Type: 1}, {Text: 'up', Value: 'up', Type: 1}, this.Back,
      {Text: 'down', Value: 'down', Type: 1}, {Text: 'right', Value: 'right', Type: 1}];

    this.dic['Options'] = [{Text: 'Run', Value: 'Run', Type: 5}, this.blank, this.Back,
      {Text: 'Exit', Value: 'Exit', Type: 5}, {Text: 'Save', Value: 'Save', Type: 5}];

    this.dic['Blocks'] = [{Text: 'Conditions', Value: 'Conditions', Type: 0}, {Text: 'Ready-Made Function', Value: 'Ready-Made Function', Type: 0}, this.Back,
      {Text: 'Definitions', Value: 'Definitions', Type: 0}, {Text: 'Loops', Value: 'Loops', Type: 0}];

    this.dic['Ready-Made Function'] = [{Text: 'Print', Value: 'Print', Type: 12}, {Text: 'Input', Value: 'Input', Type: 13}, this.Back,
      {Text: 'To String', Value: 'To String', Type: 14}, {Text: 'more-fucntions', Value: 'more fucntions', Type: 0}];

    this.dic['Definitions'] = [{Text: 'int', Value: 'int', Type: 6}, {Text: 'float', Value: 'float', Type: 6}, this.Back,
    {Text: 'String', Value: 'String', Type: 6}, {Text: 'more-definitions', Value: 'more definitions', Type: 0}];

    this.dic['more-definitions'] = [{Text: 'long', Value: 'long', Type: 6},
    {Text: 'char', Value: 'char', Type: 6}, this.Back, {Text: 'boolean', Value: 'boolean', Type: 6}, this.blank];

    this.dic['Numbers'] = [{Text: '0-4', Value: '0 1 2', Type: 0}, {Text: '3-4', Value: '3 4', Type: 0},
    this.Back, {Text: '5-9', Value: '5 6 7', Type: 0}, {Text: '8-9', Value: '8 9', Type: 0}];

    this.dic['boolean'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
    {Text: ';', Value: ';', Type: 9}, {Text: 'Numbers', Value: 'Numbers', Type: 0}];

    this.dic['int'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
    {Text: ';', Value: ';', Type: 9}, {Text: 'Numbers', Value: 'Numbers', Type: 0}];

    this.dic['long'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
    {Text: ';', Value: ';', Type: 9}, {Text: 'Numbers', Value: 'Numbers', Type: 0}];

    this.dic['float'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
    {Text: ';', Value: ';', Type: 9}, {Text: 'Numbers', Value: 'Numbers', Type: 0}];

    this.dic['String'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '= "";', Value: '=', Type: 8}, this.Back,
    {Text: ';', Value: ';', Type: 9}, {Text: 'Numbers', Value: 'Numbers', Type: 0}];

    this.dic['char'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '= \'\';', Value: '=', Type: 8}, this.Back,
    {Text: ';', Value: ';', Type: 9}, {Text: 'Numbers', Value: 'Numbers', Type: 0}];

    this.dic['= int'] = [{Text: 'Numbers', Value: 'Numbers', Type: 0}, {Text: ';', Value: ';', Type: 9}, this.Back, this.blank, this.blank];

    this.dic['= long'] = [{Text: 'Numbers', Value: 'Numbers', Type: 0}, {Text: ';', Value: ';', Type: 9},
    this.Back, this.blank, this.blank];

    this.dic['= boolean'] = [{Text: 'true', Value: 'true', Type: 0}, {Text: 'false', Value: 'false', Type: 9},
    this.Back, this.blank, this.blank];

    this.dic['= float'] = [{Text: 'Numbers', Value: 'Numbers', Type: 0}, {Text: ';', Value: ';', Type: 9},
    this.Back, {Text: '.', Value: '.', Type: 1}, this.blank];

    // this.dic['= String'] = [{Text: '" ";', Value: '" ";', Type: 1}, {Text: 'Letters', Value: 'Letters', Type: 0},
    // this.Back, {Text: 'Numbers', Value: 'Numbers', Type: 0}, {Text: '.', Value: '.', Type: 1}];

    // this.dic['= char'] = [{Text: '\' \';', Value: '\' \';', Type: 1}, {Text: 'Letters', Value: 'Letters', Type: 0},
    // this.Back, {Text: 'Numbers', Value: 'Numbers', Type: 0}, {Text: '.', Value: '.', Type: 1}];

    this.dic['Conditions'] = [
      {Text: 'if (  ) ', Value: 'if', Type: 10}, {Text: 'else if (  ) ', Value: 'else if', Type: 10},
      this.Back, {Text: 'else ', Value: 'else', Type: 10},
      this.blank];

    this.dic['if (  ) '] = [
      {Text: 'Letters', Value: 'Letters', Type: 0},
      {Text: 'down', Value: 'down', Type: 11}, this.Back,
      {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
      this.blank];
    this.dic['else if (  ) '] = [
        {Text: 'Letters', Value: 'Letters', Type: 0},
        {Text: 'down', Value: 'down', Type: 11},
        this.Back,
        {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
        this.blank];

    this.dic['Loops'] = [
      {Text: 'while (  ) ', Value: 'while', Type: 10}, {Text: 'do {  } while(  );', Value: 'do while', Type: 12},
      this.Back, {Text: 'for (  ) ', Value: 'for', Type: 10},
      this.blank];

    this.dic['while (  ) '] = [
      {Text: 'Letters', Value: 'Letters', Type: 0},
      {Text: 'down', Value: 'down', Type: 11}, this.Back,
      {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
      this.blank];

    this.dic['do {  } while(  );'] = [
      {Text: 'Letters', Value: 'Letters', Type: 0},
      {Text: 'up', Value: 'up', Type: 11}, this.Back,
      {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
      this.blank];

    this.dic['for (  ) '] = [
      {Text: 'Letters', Value: 'Letters', Type: 0},
      {Text: 'Definitions', Value: 'Definitions', Type: 0}, this.Back,
      {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
      {Text: 'SemiColon / End Condition', Value: 'SemiColon / End Condition', Type: 0}];

    this.dic['SemiColon / End Condition'] = [
      {Text: ';', Value: ';', Type: 0},
      this.blank,
      this.Back,
      {Text: 'down', Value: 'down', Type: 11},
      this.blank
    ];

    this.dic['Definitions'] = [{Text: 'int', Value: 'int', Type: 6}, {Text: 'float', Value: 'float', Type: 6}, this.Back,
      {Text: 'String', Value: 'String', Type: 6}, {Text: 'more-definitions', Value: 'more definitions', Type: 0}];

    this.dic['more-definitions'] = [{Text: 'long', Value: 'long', Type: 6},
      {Text: 'char', Value: 'char', Type: 6}, this.Back, {Text: 'boolean', Value: 'boolean', Type: 6}, this.blank];


    this.dic['Classes'] = [
      {Text: 'None', Value: 'none-Class', Type: 6},
      {Text: 'Private', Value: 'private-Class', Type: 6},
      this.Back,
      {Text: 'Public', Value: 'public-Class', Type: 6},
      {Text: 'Protected', Value: 'protected-Class', Type: 6}
    ];

    this.dic['class'] = [
      {Text: 'definition', Value: 'void', Type: 6},
      {Text: 'letters, numbers, characters', Value: 'int', Type: 6},
      this.Back,
      {Text: 'extends, implements', Value: 'double', Type: 6},
      {Text: 'characters', Value: 'float', Type: 6},
    ];

    this.dic['def-class'] = [
      {Text: 'void', Value: 'void', Type: 6},
      {Text: 'int', Value: 'int', Type: 6},
      {Text: 'double', Value: 'double', Type: 6},
      {Text: 'float', Value: 'float', Type: 6},
      {Text: 'String', Value: 'String', Type: 6},
    ];
    //

    this.displayText(this.dic[this.root]);
  }

  runTest() {
    this.dictionaryUpdate();
    this.editor.getEditor().session.setUseWrapMode(true);
    this.editor.getEditor().renderer.setScrollMargin(10, 10);
    this.editor.getEditor().setOptions({
      printMargin: true,
      enableBasicAutocompletion: true,
      autoScrollEditorIntoView: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
    this.showTest = false;
    this.textarea = document.querySelector('textarea');
    this.textarea.focus();

    this.editor.getEditor().gotoLine(5);
    this.keyboardPress('right');
    this.keyboardPress('right');

    let arrayList = [3,1,0,2,0,3,0,2,0,4,1,2,2,4,4,0,2,2,2,2,0]
    let i = 0;
    setInterval(() => {
      this.parse(arrayList[i])
      i++;
    }, 2000)

  }

  //  types --> 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 -->
  // 0: another this.dic, 1: keyboard key, 2: text, 3: this.back, 4: this.Blank
  // 5: function, 6: flowchart
  // 7: = int, 8: = string, 9: end flowchart
  // {Text: 'Letters', Value: 'Letters', Type: 0}

  parse(input) {
    console.log('parse', input);
    this.textarea.focus();

    if (this.stack.length === 0) {
      console.log(this.root);
      console.log(this.dic[this.root][input]);
      this.stack.push(this.root);
      this.stack.push(this.dic[this.root][input]['Text']);
      this.displayText(this.dic[this.stack[this.stack.length - 1]]);
    } else {
      if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 4) {
        return;
      }
      if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 5) {
        if (this.dic[this.stack[this.stack.length - 1]][input]['Text'] === 'Save') {
          if (this.service.fileName.indexOf(".java") === -1){
            this.service.fileName = this.service.fileName + ".java"
          }
          this.saveFile(this.service.fileName, this.text);
          return;
        } else if (this.dic[this.stack[this.stack.length - 1]][input]['Text'] === 'Exit') {
          this.service.loaded = false;
          return;
        } else if (this.dic[this.stack[this.stack.length - 1]][input]['Text'] === 'Run') {
          if (this.service.fileName.indexOf(".java") === -1){
            this.service.fileName = this.service.fileName + ".java"
          }
          this.runCode(this.service.fileName, this.text);
          return;
        }
      }
      if (this.stack.length === 1) {
        if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 6) {
          const cursor = this.editor.getEditor().selection.getCursor();
          this.editor.getEditor().session.insert(cursor, this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ');
        }
        this.stack.push(this.dic[this.stack[this.stack.length - 1]][input]['Text']);
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Text'] in this.dic) {
        if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 6) {
          const cursor = this.editor.getEditor().selection.getCursor();
          this.editor.getEditor().session.insert(cursor, this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ');
        } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 10) {
          const cursor = this.editor.getEditor().selection.getCursor();
          this.editor.getEditor().session.insert(cursor, this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ');
          this.keyboardPress('{');
          this.keyboardPress('enter');
          this.keyboardPress('up');
          this.keyboardPress('right');
          if (this.dic[this.stack[this.stack.length - 1]][input]['Text'].indexOf('else') !== -1) {
            this.keyboardPress('right');
            this.keyboardPress('right');
            this.keyboardPress('right');
            this.keyboardPress('right');
            this.keyboardPress('right');
          }
        } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 12) {
          const cursor = this.editor.getEditor().selection.getCursor();
          this.editor.getEditor().session.insert(cursor, this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('left');
          this.keyboardPress('enter');
          this.keyboardPress('down');
          this.keyboardPress('right');
          this.keyboardPress('right');
          this.keyboardPress('right');
          this.keyboardPress('right');
          this.keyboardPress('right');
        }
        this.stack.push(this.dic[this.stack[this.stack.length - 1]][input]['Text']);
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 7) {
        const newText = this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ' + this.stack[this.stack.length - 1];
        this.editor.getEditor().session.insert(this.editor.getEditor().selection.getCursor(),
        ' ' + this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ');
        this.stack.push(newText);
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 12){
        const cursor = this.editor.getEditor().selection.getCursor();
        this.editor.getEditor().session.insert(cursor, "System.out.println(\"\");"); 
        this.keyboardPress('left');
        this.keyboardPress('left');
        this.keyboardPress('left');
        this.stack.pop();
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 8) {
        this.editor.getEditor().session.insert(this.editor.getEditor().selection.getCursor(),
        ' ' + this.dic[this.stack[this.stack.length - 1]][input]['Text']);
        this.keyboardPress('left');
        this.keyboardPress('left');
        while (this.stack[this.stack.length - 1] !== this.root) {
          this.stack.pop();
        }
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 10) {
        const cursor = this.editor.getEditor().selection.getCursor();
        this.editor.getEditor().session.insert(cursor, this.dic[this.stack[this.stack.length - 1]][input]['Text'] + ' ');
        this.keyboardPress('{');
        this.keyboardPress('enter');
        while (this.stack[this.stack.length - 1] !== 'Conditions') {
          this.stack.pop();
        }
        this.stack.pop();
        this.stack.pop();
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else {
        if (input === 2) {
          this.stack.pop();
          this.displayText(this.dic[this.stack[this.stack.length - 1]]);
        } else {
          this.displayText(this.dic[this.stack[this.stack.length - 1]]);
          // this.writeText(this.dic[this.stack[this.stack.length - 1]][input]);
          if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 9) {
            this.editor.getEditor().session.insert(this.editor.getEditor().selection.getCursor(),
            this.dic[this.stack[this.stack.length - 1]][input]['Text']);
            if (this.stack.indexOf('Loops') !== -1) {
              this.stack.pop();
              this.stack.pop();
              this.displayText(this.dic[this.stack[this.stack.length - 1]]);
            } else {
              this.keyboardPress('enter');
              while (this.stack[this.stack.length - 1] !== 'Definitions') {
                this.stack.pop();
              }
              this.displayText(this.dic[this.stack[this.stack.length - 1]]);
            }

          } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 1) {
            this.keyboardPress(this.dic[this.stack[this.stack.length - 1]][input]['Text']);
          } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 11) {
            this.keyboardPress(this.dic[this.stack[this.stack.length - 1]][input]['Text']);
            if ( this.stack.indexOf('Conditions') !== -1) {
              while (this.stack[this.stack.length - 1] !== 'Conditions') {
                this.stack.pop();
              }
              this.stack.pop();
              this.stack.pop();
            } else if ( this.stack.indexOf('Loops') !== -1) {
              this.stack.pop();
              this.stack.pop();
              this.stack.pop();
            }
            this.displayText(this.dic[this.stack[this.stack.length - 1]]);
          } else {
            const cursor = this.editor.getEditor().selection.getCursor();
            this.editor.getEditor().session.insert(cursor, this.dic[this.stack[this.stack.length - 1]][input]['Text']);
          }
          // this.editor.setText("102020", this.editor.getCursorPosition())
        }
      }
    }
  }

  displayText(list) {
    this.upLeftText = list[0]['Value'];
    this.downLeftText = list[1]['Value'];
    this.upMiddleText = list[2]['Value'];
    this.upRightText = list[3]['Value'];
    this.downRightText = list[4]['Value'];
  }

  writeText(text) {
    console.log(text);
    this.socket.emit('clickGui', { data: text });
  }

  keyboardPress(btn) {
    this.socket.emit('pressGui', { data: btn });
  }

  shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  saveFile(name, content) {
    this.showWait = true;
    this.socket.emit('saveFile', { name: name, data: content });
  }

  runCode(name, content) {
    this.showWait = true;
    this.socket.emit('runCode', { name: name, data: content });
  }

}
