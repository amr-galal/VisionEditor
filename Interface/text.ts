
this.dic = {};
this.blank = {Text: 'Back', Value: '', Type: 4};
this.Back = {Text: 'Back', Value: '', Type: 3};
this.root = 'root';
//  types --> 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 -->
// 0: another this.dic, 1: keyboard key, 2: text, 3: this.back, 4: this.Blank
// 5: function, 6: flowchart
// 7: = int, 8: = string, 9: end flowchart

this.dic[this.root] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: 'Arrows', Value: 'Arrows', Type: 0},
  {Text: 'Options', Value: 'Options', Type: 0}, {Text: 'Blocks', Value: 'Blocks', Type: 0},
  {Text: 'Numbers, Operators, Characters', Value: 'Numbers, Operators, Characters', Type: 0},
];

// #########################
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

this.dic['k-m'] = [{Text: 'q', Value: 'q', Type: 1}, {Text: 'r', Value: 'r', Type: 1}, this.Back,
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
  this.Back, {Text: 'Bitwise', Value: 'Bitwise', Type: 0}, {Text: 'Relational and Assignment', Value: 'Relational and Assignment', Type: 0}];

this.dic['Arithmetic'] = [{Text: '+', Value: '+', Type: 1}, {Text: '-', Value: '-', Type: 1}, this.Back,
  {Text: '*', Value: '*', Type: 1}, {Text: '/', Value: '/', Type: 1}];

this.dic['Logical'] = [{Text: '&&', Value: '&&', Type: 1}, {Text: '||', Value: '||', Type: 1}, this.Back,
  {Text: '!', Value: '!', Type: 1}, {Text: '==', Value: '==', Type: 1}];

this.dic['Bitwise'] = [{Text: '&', Value: '&', Type: 1}, {Text: '|', Value: '|', Type: 1}, this.Back,
  {Text: '^', Value: '^', Type: 1}, {Text: '~', Value: '~', Type: 1}];

this.dic['Relational and Assignment'] = [{Text: '=', Value: '=', Type: 1}, {Text: '<', Value: '<', Type: 1}, this.Back,
  {Text: '>', Value: '>', Type: 1}, this.blank];

this.dic['Characters'] = [{Text: 'enter', Value: 'enter', Type: 1}, {Text: 'delete', Value: 'delete', Type: 1}, this.Back,
  {Text: 'backspace', Value: 'backspace', Type: 1}, {Text: 'tab', Value: 'tab', Type: 1}];

this.dic['Arrows'] = [{Text: 'left', Value: 'left', Type: 1}, {Text: 'up', Value: 'up', Type: 1}, this.Back,
  {Text: 'down', Value: 'down', Type: 1}, {Text: 'right', Value: 'right', Type: 1}];

this.dic['Options'] = [{Text: 'Run', Value: 'Run', Type: 5}, {Text: 'Compile', Value: 'Compile', Type: 5}, this.Back,
  {Text: 'Debug', Value: 'Debug', Type: 5}, {Text: 'Save', Value: 'Save', Type: 5}];

this.dic['Blocks'] = [{Text: 'Conditions', Value: 'Conditions', Type: 0}, {Text: 'Loops', Value: 'Loops', Type: 0}, this.Back,
  {Text: 'Functions', Value: 'Functions', Type: 0}, {Text: 'Definitions', Value: 'Definitions', Type: 0}];


this.dic['Definitions'] = [{Text: 'int', Value: 'int', Type: 6}, {Text: 'float', Value: 'float', Type: 6}, this.Back,
{Text: 'String', Value: 'String', Type: 6}, {Text: 'more-definitions', Value: 'more definitions', Type: 6}];

this.dic['more-definitions'] = [{Text: 'long', Value: 'long', Type: 6}, {Text: 'char', Value: 'char', Type: 6}, this.Back, this.blank, this.blank];

this.dic['int'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
{Text: ';', Value: ';', Type: 9}, {Text: '0-4', Value: '0-4', Type: 0}];

this.dic['long'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
{Text: ';', Value: ';', Type: 9}, {Text: '0-4', Value: '0-4', Type: 0}];

this.dic['float'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 7}, this.Back,
{Text: ';', Value: ';', Type: 9}, {Text: '0-4', Value: '0-4', Type: 0}];

this.dic['String'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 8}, this.Back,
{Text: ';', Value: ';', Type: 9}, {Text: '0-4', Value: '0-4', Type: 0}];

this.dic['char'] = [{Text: 'Letters', Value: 'Letters', Type: 0}, {Text: '=', Value: '=', Type: 8}, this.Back,
{Text: ';', Value: ';', Type: 9}, {Text: '0-4', Value: '0-4', Type: 0}];

this.dic['= int'] = [{Text: '0-4', Value: '0-4', Type: 0}, {Text: ';', Value: ';', Type: 9}, this.Back, this.blank, this.blank];

this.dic['= float'] = [{Text: '0-4', Value: '0-4', Type: 0}, {Text: ';', Value: ';', Type: 9},
this.Back, {Text: '.', Value: '.', Type: 1}, this.blank];

this.dic['= string'] = [{Text: '" ";', Value: '" ";', Type: 1},
{Text: 'Letters', Value: 'Letters', Type: 0}, this.Back, {Text: '0-4', Value: '0-4', Type: 0}, {Text: '.', Value: '.', Type: 1}];


// this.dic['Conditions'] = ['if( ){\n', `else if( ){\n`, this.Back, `else{\n`, ``];
