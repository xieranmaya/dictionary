// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  var Delegate, Dictionary, Loading, MP3Player, dictionary, loading, player, separator, settings, title,
    __slice = [].slice;

  Dictionary = (function() {
    Dictionary.prototype.set = function(raw) {
      this.raw = raw;
      return this;
    };

    Dictionary.prototype.get = function() {
      return this.raw;
    };

    Dictionary.prototype.reset = function() {
      this.data = this.raw;
      return this;
    };

    Dictionary.prototype.filter = function() {
      var filter, filters, _i, _len, _results;

      filters = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = {};
      for (_i = 0, _len = filters.length; _i < _len; _i++) {
        filter = filters[_i];
        if (this.raw[filter] != null) {
          _results[filter] = this.raw[filter];
        }
      }
      this.data = _results;
      return this;
    };

    Dictionary.prototype.bullhorn = "<i class=\"icon-volume-up\"></i>";

    Dictionary.prototype.setBullhorn = function(bullhorn) {
      this.bullhorn = bullhorn;
      return this;
    };

    Dictionary.prototype.toHtml = function(json, type) {
      var key, object, out, tag, value, _i, _len;

      if (json == null) {
        json = this.data;
      }
      if (type == null) {
        type = false;
      }
      switch (type) {
        case false:
          out = "";
          tag = false;
          break;
        case "labels":
          out = "<span class=\"" + type + "\"" + (json.title != null ? " title=\"" + json.title + "\"" : "") + "\">" + json.text;
          tag = "span";
          break;
        default:
          switch (json.type) {
            case "text":
            case "phonetic":
              out = "<div class=\"" + type + "\"><span class=\"" + json.type + "\">" + json.text + "</span>";
              tag = "div";
              break;
            case "url":
              out = json.text;
              tag = false;
              break;
            case "sound":
              out = "<a class=\"sound\" href=\"" + json.text + "\" target=\"_blank\">" + this.bullhorn + "</a>";
              tag = false;
              break;
            default:
              out = "<div class=\"" + type + " " + json.type + "\">";
              tag = "div";
          }
      }
      for (key in json) {
        object = json[key];
        if (object instanceof Array) {
          for (_i = 0, _len = object.length; _i < _len; _i++) {
            value = object[_i];
            out += this.toHtml(value, key);
          }
        }
      }
      if (tag) {
        out += "</" + tag + ">";
      }
      return out;
    };

    function Dictionary(raw) {
      this.raw = raw != null ? raw : {};
      this.reset();
    }

    return Dictionary;

  })();

  MP3Player = (function() {
    MP3Player.prototype.play = function(url) {
      var audio, player;

      if (this["native"]) {
        audio = document.createElement("audio");
        audio.src = url;
        audio.play();
      } else {
        if (this.player == null) {
          player = document.createElement("div");
          player.style.position = "fixed";
          player.style.top = 0;
          player.style.right = 0;
          this.player = document.body.appendChild(player);
        }
        if (this.flash != null) {
          this.player.removeChild(this.flash);
        }
        this.flash = document.createElement("embed");
        this.flash.src = "//ssl.gstatic.com/dictionary/static/sounds/0/SoundApp.swf";
        this.flash.type = "application/x-shockwave-flash";
        this.flash.width = "1";
        this.flash.height = "1";
        this.flash.setAttribute("flashvars", "sound_name=" + encodeURI(url));
        this.flash.setAttribute("wmode", "transparent");
        this.player.appendChild(this.flash);
        if (window.opera) {
          this.flash.style.display = "none";
          this.flash.style.display = "block";
        }
      }
    };

    function MP3Player() {
      var test;

      test = document.createElement("audio");
      this["native"] = (test != null) && test.canPlayType && test.canPlayType("audio/mpeg") !== "";
    }

    return MP3Player;

  })();

  Loading = (function() {
    function Loading() {}

    Loading.prototype.start = function() {
      if (this.Interval != null) {
        clearInterval(this.Interval);
      }
      this.Interval = setInterval(this.load, 250);
      $("#loading").show();
      return this;
    };

    Loading.prototype.load = function() {
      var active, next;

      active = $("#loading").find(".icon-circle");
      next = active.next();
      if (!next.length) {
        next = $($("#loading").find("i")[0]);
      }
      active.toggleClass("icon-circle").toggleClass("icon-circle-blank");
      next.toggleClass("icon-circle").toggleClass("icon-circle-blank");
    };

    Loading.prototype.stop = function() {
      $("#loading").hide();
      clearInterval(this.Interval);
      return this;
    };

    return Loading;

  })();

  Delegate = (function() {
    Delegate.prototype.language = "en";

    Delegate.prototype.languages = {
      "zh-hans": "Chinese (Simplified)",
      "zh-hant": "Chinese (Traditional)",
      "cs": "Czech",
      "nl": "Dutch",
      "en": "English",
      "fr": "French",
      "de": "German",
      "it": "Italian",
      "ko": "Korean",
      "pt": "Portuguese",
      "ru": "Russian",
      "es": "Spanish"
    };

    Delegate.prototype.onChangeLanguage = function() {
      console.log("onChangeLanguage");
      console.log(this.language);
    };

    Delegate.prototype.changeLanguage = function(language) {
      if (language in this.languages) {
        this.language = language;
        this.onChangeLanguage();
      }
      return this;
    };

    Delegate.prototype.onSubmit = function() {
      console.log("onSubmit");
      console.log(this.query);
    };

    Delegate.prototype.submit = function(query) {
      var nonce,
        _this = this;

      this.query = query;
      if (this.onSubmit()) {
        nonce = ++this.nonce;
        $.ajax({
          url: "https://www.google.com/dictionary/json",
          dataType: "jsonp",
          data: {
            q: this.query,
            sl: this.language,
            tl: this.language,
            restrict: "pr,de,sy"
          },
          success: function(data) {
            if (nonce === _this.nonce) {
              return _this.onData(data);
            }
          }
        });
      }
    };

    Delegate.prototype.onData = function(data) {
      console.log("onData");
      console.log(data);
    };

    Delegate.prototype.onLoad = function() {
      console.log("onLoad");
    };

    function Delegate(options) {
      var key, value;

      this.nonce = 0;
      for (key in options) {
        value = options[key];
        this[key] = value;
      }
      this.onLoad();
    }

    return Delegate;

  })();

  if (typeof localStorage !== "undefined" && localStorage !== null) {
    settings = localStorage.getItem("dictionary.settings");
    window.onunload = function() {
      localStorage.setItem("dictionary.settings", JSON.stringify(settings));
    };
  }

  settings = settings != null ? JSON.parse(settings) : {
    language: "en",
    options: {
      examples: true,
      synonyms: true,
      webDefinitions: false
    }
  };

  title = document.title;

  separator = ".";

  window.onhashchange = function() {
    var currentLanguage, hash, index, language, query;

    hash = decodeURIComponent(location.hash.substr(1));
    index = hash.lastIndexOf(separator);
    if (index === -1) {
      if (dictionary.query !== hash) {
        dictionary.submit(hash);
      }
    } else {
      currentLanguage = dictionary.language;
      language = hash.substr(index + 1);
      query = hash.substr(0, index);
      if (currentLanguage !== language) {
        dictionary.changeLanguage(language);
      }
      if (dictionary.query !== query || dictionary.language !== currentLanguage) {
        dictionary.submit(query);
      }
    }
  };

  player = new MP3Player();

  loading = new Loading();

  dictionary = new Delegate({
    language: settings.language,
    onLoad: function() {},
    onChangeLanguage: function() {
      settings.language = this.language;
      if ($("#language").val() !== this.language) {
        $("#language").val(this.language);
      }
    },
    onSubmit: function() {
      $("#query").val(this.query);
      location.href = "#" + this.query + separator + this.language;
      if (this.query === "") {
        $("#dictionary").hide();
        document.title = title;
        $("header").fadeIn("slow");
        return false;
      } else {
        $("header").hide();
        $("#dictionary").empty();
        loading.start();
        document.title = this.query + " « " + this.languages[this.language];
        return true;
      }
    },
    onData: function(data) {
      $("#dictionary").html(new Dictionary(data).filter("synonyms", "primaries", "webDefinitions").toHtml());
      if (($("#dictionary>.synonyms>.terms>.text")[0] != null) && ($("#dictionary>.primaries>.terms>.text")[0] != null)) {
        $("#dictionary>.synonyms>.terms>.text")[0].innerHTML = $("#dictionary>.primaries>.terms>.text")[0].innerHTML;
      }
      $("#dictionary a.sound").click(function(event) {
        event.preventDefault();
        player.play($(this).attr("href"));
      });
      $("#dictionary .synonyms>.related>.terms>span.text").click(function() {
        dictionary.submit($(this).text());
      });
      $("#dictionary>.webDefinitions a").each(function() {
        var nextlink;

        nextlink = $(this).parent().next(".meaning").children("a");
        if ($(this).text() === nextlink.text()) {
          $(this).hide();
        }
      });
      if (!settings.options.synonyms) {
        $("#dictionary .synonyms>.related").hide();
      }
      if (!settings.options.examples) {
        $("#dictionary .example").hide();
      }
      if (!settings.options.webDefinitions) {
        $("#dictionary .webDefinitions").hide();
      }
      $("#dictionary").show();
      loading.stop();
    }
  });

  $(document).ready(function() {
    var key, lastAjaxACRequestNonce, lastSubmitNonce, nonce, option, status, value, _ref, _ref1;

    _ref = dictionary.languages;
    for (key in _ref) {
      value = _ref[key];
      option = new Option(value, key);
      if (key === dictionary.language) {
        option.selected = true;
      }
      document.getElementById("language").add(option, null);
    }
    _ref1 = settings.options;
    for (option in _ref1) {
      status = _ref1[option];
      if (status) {
        $("#" + option).addClass("active");
      }
    }
    if (location.hash) {
      window.onhashchange();
    }
    $("#language").change(function() {
      return dictionary.changeLanguage($(this).val());
    });
    $("#toggle-options").click(function() {
      return $("#options-wrapper").toggle();
    });
    $("#synonyms").click(function() {
      settings.options.synonyms = !settings.options.synonyms;
      return $(".synonyms>.related").toggle();
    });
    $("#examples").click(function() {
      settings.options.examples = !settings.options.examples;
      return $(".example").toggle();
    });
    $("#webDefinitions").click(function() {
      settings.options.webDefinitions = !settings.options.webDefinitions;
      return $(".webDefinitions").toggle();
    });
    nonce = 0;
    lastSubmitNonce = nonce;
    $("#submit").submit(function(event) {
      event.preventDefault();
      dictionary.submit($("#query").val());
      return lastSubmitNonce = nonce++;
    });
    lastAjaxACRequestNonce = nonce;
    $("#query").typeahead({
      source: function(query, process) {
        var ajaxACRequestNonce,
          _this = this;

        ajaxACRequestNonce = nonce++;
        lastAjaxACRequestNonce = ajaxACRequestNonce;
        $.ajax({
          url: "http://" + dictionary.language.substr(0, 2) + ".wiktionary.org/w/api.php",
          dataType: "jsonp",
          data: {
            search: query,
            action: "opensearch"
          },
          success: function(data) {
            if (lastSubmitNonce < ajaxACRequestNonce && ajaxACRequestNonce === lastAjaxACRequestNonce) {
              process(data[1]);
              _this.$menu.find(".active").removeClass("active");
            } else {
              process([]);
            }
          }
        });
      },
      updater: function(item) {
        if (item != null) {
          dictionary.submit(item);
          return item;
        } else {
          dictionary.submit(this.$element.val());
          return this.$element.val();
        }
      }
    });
  });

}).call(this);
