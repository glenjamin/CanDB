var util = require('util');

var present = require('present-express');

module.exports = present.create(function(data) {
    this.layout = 'layout';
    this.template = 'simple';

    this.data.flash = data.flash();

    this.data.site = 'CanDB';
    Object.defineProperty(this.data, 'title', {
        get: function() {
            return this.site + (this.page ? ' | ' + this.page : '')
        },
        enumerable: true
    });

    var menu = this.data.menu = [
        { id: 'dash', 'href': '/', 'link': 'Dashboard' },
        { id: 'candidates', 'href': '/candidates', 'link': 'Candidates' },
    ];

    this.menu = {
        activate: function(item) {
            menu.forEach(function(menuitem) {
                if (menuitem.id == item) {
                    menuitem.active = true;
                }
            })
        }
    }

    function hiddenInput(name, value) {
      return util.format(
        '<input type="hidden" name="%s" value="%s">', name, value);
    }
    this.csrfInput = function() {
      return hiddenInput('_csrf', data.csrf);
    }
    this.renderForm = function(form, methodOverride) {
      if (typeof form === 'string') methodOverride = form, form = null;
      var bits = [];
      bits.push(this.csrfInput());
      methodOverride && bits.push(hiddenInput('_method', methodOverride));
      form && bits.push(form.toHTML(function(name, field) {
        return present.render('_formfield', {
          'classes': field.classes().join(' '),
          'label': field.labelText(name),
          'label-for': 'id_' + name,
          'widget': field.widget.toHTML(name, field),
          'error': field.error
        });
      }));
      return bits.join('\n');
    }
})
