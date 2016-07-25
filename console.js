module.exports = function() {    
  /* 
  [color]Text
  Transfrom Text for a specific color
  IN: string (string)
  OUT: colored_string (string)
  */
  this.redText = function(string) {
      return '\u001b[31m'+string+'\u001b[39m';
  };
  this.greenText = function(string) {
      return '\u001b[32m'+string+'\u001b[39m';
  };
  this.yellowText = function(string) {
      return '\u001b[33m'+string+'\u001b[39m';
  };
  /* 
  log
  Write a thing in console
  IN: text (string) type(string)
  OUT: -
  */
  this.log = function (text,type,nodate) {
    switch(type) {
      case "warn":
      text = redText('WARING:') + yellowText(text);
      break;
      case "info":
      text = greenText(text);
      break;
      default:
      }
      if(nodate==false||nodate==undefined) { text = logdate() + "  " + text;}

      console.log(text)
  };
  this.logdate = function() {
      return yellowText(getDateTime());
  };
};