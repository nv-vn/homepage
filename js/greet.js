$(document).ready(function () {
  $('.term-input').focus();
  $('.term-input').val('');

  var typewriter_html  = $('.typewriter').html();
  var typewriter_value = '';
  function getTime(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  $('.content').fadeOut(0);
  (function animate(c) {
    $('.typewriter').html(typewriter_value);
    setTimeout(function () {
      $('.typewriter').html(typewriter_value + '|');
      setTimeout(function () {
        $('.typewriter').html(typewriter_value);
        setTimeout(function () {
          typewriter_value += typewriter_html.charAt(c);
          $('.typewriter').html(typewriter_value);
          var none = c < typewriter_html.length ? animate(++c) : (function () {
            $('.welcome').animate({ marginBottom : '-=600px' }, 2500);
            $('.content').fadeIn(2500);
            setTimeout(postLoad, 2500);
          })();
        }, 100 + getTime(-70, 50));
      }, 200);
    }, 200);
  })(0);
});

var selecting = false;
var tabSelection = 0;
var mode = 'none';
var squery = '';
function postLoad() {
  $('.term-input').keyup(function (e) {
    if (e.keyCode == 13) {
      var query = $('.term-input').val();
      $('.term-input').val('');
      var split = query.split(' ');
      if (split[0] == 'ls') {
        mode = 'ls';
        $('#results').fadeOut(0);
        $('#results').fadeIn(300);
        // Edit these to change the output of `ls`
        $('#results').html('<span class="opt">4chan.org/g/</span><br />');
        $('#results').append('<span class="opt">4chan.org/gd/</span><br />'); // Copy this line for all options after 1
      } else if (split[0] == 'cd') {
        var url = split[1].charAt(0) == '~'
          ? 'file://' + split[1].replace('~', getHome())
          : split[1].charAt(0) == '/'
            ? 'file://' + split[1]
            : window.location.href.replace('index.html', '') + split[1];
        window.open(url, '_blank');
      } else if (split[0] == 'chroot') {
        window.open('https://' + split[1], '_blank');
      } else if (split[0] == 'find') {
        mode = 'find';
        selecting = true;
        squery = split.splice(1, split.length).join(' ');
        $('#results').fadeOut(0);
        $('#results').fadeIn(300);
        // Edit these to change the output of the `find` command
        $('#results').html('<span class="opt">google</span><br />');
        $('#results').append('<span class="opt">duckduckgo</span><br />');
      } else if (split[0] == 'play') {
        squery = split.splice(1, split.length).join(' ');
        if (squery === '') {
          mode = 'play';
          selecting = true;
          $('#results').fadeOut(0);
          $('#results').fadeIn(300);
          $('#results').html('');
          var songs = [
            // Your list of songs goes here!
          ];
          for (var song in songs) {
            $('#results').append('<span class="opt">' + songs[song] + '</span><br/>');
          }
        } else {
          var tag = '<audio autoplay="true" src="' +
            window.location.href.replace('index.html', 'music/') + squery + '.mp3">';
          $('#music').html(tag);
        }
      } else if (split[0] == 'stop') {
        $('#music').html('');
      } else if (split[0] == 'clear') {
        mode = 'none';
        $('#results').fadeOut(300);
        setTimeout(function () {
          $('#results').html('');
        }, 150);
      }
    }
  });
  $(document).keypress(function (e) {
    if (e.which == 9 || e.keyCode == 9) {
      selecting = true;
      e.preventDefault();
      var limit = $('.opt').length;
      var highlight = tabSelection++ % limit;
      $('.opt').css({ backgroundColor: '#282828' });
      $($('.opt')[highlight]).css({ backgroundColor: '#ffffff' });
    } else if (e.keyCode == 13) {
      if (selecting && mode == 'ls') {
        window.open('https://'
         + $($('.opt')[(tabSelection - 1) % $('.opt').length]).html(), '_blank');
      } else if (selecting && mode == 'play') {
        var tag = '<audio autoplay="true" src="' +
          window.location.href.replace('index.html', 'music/') +
            $($('.opt')[(tabSelection - 1) % $('.opt').length]).html() + '.mp3">';
        $('#music').html(tag);
      } else if (selecting && mode == 'find') {
        switch($($('.opt')[(tabSelection - 1) % $('.opt').length]).html()) {
          // Add all cases here to handle the selection in the `find` command
          case 'google':
            window.open('https://www.google.com/search?q=' + squery, '_blank');
            break;
          case 'duckduckgo':
            window.open('https://duckduckgo.com/?q=' + squery, '_blank');
            break;
        }
      }
    } else {
      selecting = false;
      tabSelection = 0;
      $('.opt').css({ backgroundColor: '#282828' });
      mode = 'none';
    }
  });
}

function getHome() {
  var path = window.location.href;
  path.replace('file://', '');
  return path.match(/\/home\/[A-Za-z_\-.+0-9]*/);
}
