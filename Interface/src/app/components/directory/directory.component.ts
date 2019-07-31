import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ServiceService } from '../../service.service';
import * as workerTimers from 'worker-timers';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {

  upLeft = false;
  upMiddle = false;
  downLeft = false;
  upRight = false;
  downRight = false;
  showWait = false;
  upLeftText = '';
  upRightText = '';
  downLeftText = '';
  downRightText = '';
  upMiddleText = '';
  dic = {};
  blank = {Text: 'Blank', Value: '', Type: 4};
  Back = {Text: 'Back', Value: 'Back', Type: 3};
  root = 'root';
  stack = [];
  selectCreate = -1;
  fileDirectory = -1;
  fileDirectoryName = '';
  directoryList = [];
  directoryListOriginal = [];
  directory = '';
  fileContent = '';
  startCode = false;

  constructor(private socket: Socket, private service: ServiceService) {

    setInterval(() => {}, );

    this.dic[this.root] = [
      {Text: 'Select', Value: 'Select File', Type: 0},
      {Text: 'Create', Value: 'Create File', Type: 0},
      {Text: 'Go Back Directory', Value: 'Go Back Directory', Type: 8},
      {Text: 'Select', Value: 'Select Directory', Type: 1},
      {Text: 'Create', Value: 'Create Directory', Type: 1}
    ];

    this.dic['Select'] = [{Text: '0', Value: '0', Type: 1}, {Text: '1', Value: '1', Type: 1}, this.Back,
      {Text: '2', Value: '2', Type: 1}, {Text: '3-24', Value: '3-24', Type: 0}];

    this.dic['3-24'] = [{Text: '3', Value: '3', Type: 1}, {Text: '4', Value: '4', Type: 1}, this.Back,
      {Text: '5', Value: '5', Type: 1}, {Text: '6-24', Value: '6-24', Type: 0}];

    this.dic['6-24'] = [{Text: '6', Value: '6', Type: 1}, {Text: '7', Value: '7', Type: 1}, this.Back,
      {Text: '8', Value: '8', Type: 1}, {Text: '9-24', Value: '9-24', Type: 0}];

    this.dic['9-24'] = [{Text: '9', Value: '9', Type: 1}, {Text: '10', Value: '10', Type: 1}, this.Back,
      {Text: '11', Value: '11', Type: 1}, {Text: '12-24', Value: '12-24', Type: 0}];

    this.dic['12-24'] = [{Text: '12', Value: '12', Type: 1}, {Text: '13', Value: '13', Type: 1}, this.Back,
      {Text: '14', Value: '14', Type: 1}, {Text: '15-24', Value: '15-24', Type: 0}];

    this.dic['15-24'] = [{Text: '15', Value: '15', Type: 1}, {Text: '16', Value: '16', Type: 1}, this.Back,
      {Text: '17', Value: '17', Type: 1}, {Text: '18-24', Value: '18-24', Type: 0}];

    this.dic['18-24'] = [{Text: '18', Value: '18', Type: 1}, {Text: '19', Value: '19', Type: 1}, this.Back,
      {Text: '20', Value: '20', Type: 1}, {Text: '21-24', Value: '21-24', Type: 0}];

    this.dic['21-24'] = [{Text: '21', Value: '21', Type: 1}, {Text: '22', Value: '22', Type: 1}, this.Back,
      {Text: '23', Value: '23', Type: 1}, {Text: '24', Value: '24', Type: 1}];

    this.dic['Create0'] = [
      {Text: 'Letters', Value: 'Letters', Type: 0},
      {Text: 'Numbers-Characters', Value: 'Numbers-Characters', Type: 0},
      this.Back,
      {Text: 'Open', Value: 'Open', Type: 0},
      {Text: 'backspace', Value: 'backspace', Type: 5},
    ];

    this.dic['Create1'] = [
      {Text: 'Letters', Value: 'Letters', Type: 0},
      {Text: 'Numbers-Characters', Value: 'Numbers-Characters', Type: 0},
      this.Back,
      {Text: 'Open', Value: 'Open', Type: 6},
      {Text: 'backspace', Value: 'backspace', Type: 5},
    ];

    this.dic['Open'] = [
      {Text: 'Entry Class', Value: 'Entry Class', Type: 6},
      this.blank,
      this.Back,
      {Text: 'Normal Class', Value: 'Normal Class', Type: 6},
      this.blank
    ];

    this.dic['Numbers-Characters'] = [
      {Text: 'Numbers', Value: 'Numbers', Type: 0},
      this.blank, this.Back,
      {Text: 'Characters', Value: 'Characters', Type: 0},
      this.blank];

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

    this.dic['Numbers'] = [{Text: '0', Value: '0', Type: 1}, {Text: '1', Value: '1', Type: 1}, this.Back,
      {Text: '2', Value: '2', Type: 1}, {Text: '3-4', Value: '3 4', Type: 0}];

    this.dic['3-4'] = [{Text: '3', Value: '3', Type: 1}, {Text: '4', Value: '4', Type: 1},
    this.Back, {Text: '5-9', Value: '5 9', Type: 0}, this.blank];

    this.dic['5-9'] = [{Text: '5', Value: '5', Type: 1}, {Text: '6', Value: '6', Type: 1}, this.Back,
      {Text: '7', Value: '7', Type: 1}, {Text: '8-9', Value: '8 9', Type: 0}];

    this.dic['8-9'] = [this.blank, {Text: '8', Value: '8', Type: 1}, this.Back,
      {Text: '9', Value: '9', Type: 1}, this.blank];

    this.dic['Characters'] = [{Text: '.', Value: '.', Type: 1}, {Text: '_', Value: '_', Type: 1}, this.Back,
      {Text: '-', Value: '-', Type: 1}, this.blank];

    this.displayText(this.dic[this.root]);

   }

  ngOnInit() {
    this.getlist();

    this.socket.on('getList', (socket) => {
      this.directoryList = JSON.parse(socket['data']);
      this.directoryListOriginal = JSON.parse(socket['data']);
      this.directory = socket['directory'];
      this.showWait = false;
    });

    this.socket.on('openFile', (socket) => {
      this.fileContent = socket['data'];
      this.service.fileContent = this.fileContent;
      this.service.loaded = true;
      this.showWait = false;
    });

    this.socket.on('createDirectory', (socket) => {
      this.directory = socket['directory'];
      this.directoryList = JSON.parse(socket['data']);
      this.directoryListOriginal = JSON.parse(socket['data']);
      this.showWait = false;
    });

    this.socket.on('changeDirectory', (socket) => {
      this.directory = socket['directory'];
      this.directoryList = JSON.parse(socket['data']);
      this.directoryListOriginal = JSON.parse(socket['data']);
      this.showWait = false;
    });

    this.socket.on('goBackDirectory', (socket) => {
      this.directory = socket['directory'];
      this.directoryList = JSON.parse(socket['data']);
      this.directoryListOriginal = JSON.parse(socket['data']);
      this.showWait = false;
    });
  }

  start() {
    this.startCode = true;  
    let arrayList = [1, 0, 3, 0,2,0,4,1,2,2,4,4,0,2,2,2,3,0]
    let i = 0;
    setInterval(() => {
      this.parse(arrayList[i])
      i++;
    }, 2000)
  }

  parse(input) {
    if (this.stack.length === 0) {
      this.stack.push(this.root);
      if (this.dic[this.root][input]['Type'] === 4) {
        return;
      } else if (this.dic[this.root][input]['Type'] === 8) {
        this.goBackDirectory();
        return;
      } else if (this.dic[this.root][input]['Type'] === 6 && this.fileDirectoryName !== '') {
        if (this.fileDirectory === 0) {
          if (this.dic[this.root][input]['Text'] === 'Entry Class') {
            this.openFile(this.fileDirectoryName, true);
            this.service.fileName = this.fileDirectoryName;
            this.service.directory = this.directory;
          } else {
            this.openFile(this.fileDirectoryName, false);
            this.service.fileName = this.fileDirectoryName;
            this.service.directory = this.directory;

            setTimeout(() => {
              if (!this.service.loaded){
                this.service.loaded = true;
                this.showWait = false;
              }
            }, 500);
          }
          // navigate
        } else if (this.fileDirectory === 1) {
          this.createDir(this.fileDirectoryName);
          this.stack.pop();
          this.displayText(this.dic[this.stack[this.stack.length - 1]]);
        }
      }
      const data = this.dic[this.root][input];
      if (this.dic[this.root][input]['Text'] === 'Create'){
        this.stack.push(this.dic[this.root][input]['Text'] +  (data['Type'] + ""));
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else {
        this.stack.push(this.dic[this.root][input]['Text']);
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      }
      if (data['Text'] === 'Select') {
        this.selectCreate = 0;
        this.fileDirectory = data['Type'];
        this.directoryList = this.directoryList.filter(
          (file) => this.fileDirectory === 0 ?
          file.indexOf('.') !== -1 : file.indexOf('.') === -1);
          
      } else if (data['Text'] === 'Create') {
        this.selectCreate = 1;
        this.fileDirectory = data['Type'];
      }
    } else {
      if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 4) {
        return;
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 8) {
        this.goBackDirectory();
        return;
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Type'] === 6 && this.fileDirectoryName !== '') {
        if (this.fileDirectory === 0) {
          if (this.dic[this.stack[this.stack.length - 1]][input]['Text'] === 'Entry Class') {
            this.openFile(this.fileDirectoryName, true);
            this.service.fileName = this.fileDirectoryName;
            this.service.directory = this.directory;
          } else {
            this.openFile(this.fileDirectoryName, false);
            this.service.fileName = this.fileDirectoryName;
            this.service.directory = this.directory;
          }
          // navigate
        } else if (this.fileDirectory === 1) {
          this.createDir(this.fileDirectoryName);
        }
      }
      if (this.stack.length === 1) {
        const data = this.dic[this.stack[this.stack.length - 1]][input];
        if (data['Text'] === 'Select') {
          this.selectCreate = 0;
          this.fileDirectory = data['Type'];
          this.directoryList = this.directoryList.filter(
            (file) => this.fileDirectory === 0 ?
            file.indexOf('.') !== -1 : file.indexOf('.') === -1);
        } else if (data['Text'] === 'Create') {
          this.selectCreate = 1;
          this.fileDirectory = data['Type'];
        }
        this.stack.push(this.dic[this.stack[this.stack.length - 1]][input]['Text']);
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else if (this.dic[this.stack[this.stack.length - 1]][input]['Text'] in this.dic) {
        this.stack.push(this.dic[this.stack[this.stack.length - 1]][input]['Text']);
        this.displayText(this.dic[this.stack[this.stack.length - 1]]);
      } else {
        if (input === 2) {
          this.stack.pop();
          this.displayText(this.dic[this.stack[this.stack.length - 1]]);
          if (this.stack.length === 1) {
            this.selectCreate = -1;
            this.fileDirectory = -1;
            this.fileDirectoryName = '';
            this.directoryList = JSON.parse(JSON.stringify(this.directoryListOriginal));
          }
        } else {
          const type = this.dic[this.stack[this.stack.length - 1]][input]['Type'];
          if (this.selectCreate === 1) {
            if (type === 1) {
              this.fileDirectoryName = this.fileDirectoryName + this.dic[this.stack[this.stack.length - 1]][input]['Text'];
            } else if (type === 5) {
              this.fileDirectoryName = this.fileDirectoryName.substr(0, this.fileDirectoryName.length - 1);
            }
          } else if (this.selectCreate === 0) {
            const fileName = this.directoryList[+this.dic[this.stack[this.stack.length - 1]][input]['Text']];
            if (fileName !== undefined) {
              if (this.fileDirectory === 0) {
                this.openFile(fileName, false);
                this.service.fileName = fileName;
                this.service.directory = this.directory;
                // navigate
              } else if (this.fileDirectory === 1) {
                this.changeDirectory(fileName);
                this.stack.pop();
                this.displayText(this.dic[this.stack[this.stack.length - 1]]);
              }
            }
          }
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

  openFile(name, mainClass) {
    this.showWait = true;
    if (name.indexOf('.java') === -1) {
      name = name + ".java";
    }
    console.log(name)
    this.socket.emit('openFile', { name: name, mainClass: mainClass });
  }

  getlist() {
    this.showWait = true;
    this.socket.emit('getList', {});
  }

  createDir(name) {
    this.showWait = true;
    this.socket.emit('createDirectory', { name: name });
  }

  changeDirectory(name) {
    this.showWait = true;
    this.socket.emit('changeDirectory', { name: name });
  }

  goBackDirectory() {
    this.showWait = true;
    this.socket.emit('goBackDirectory', { num: 1 });
  }
}
