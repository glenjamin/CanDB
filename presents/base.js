var util = require('util');

var present = require('present-express');

module.exports = present.create(function(data) {
    this.layout = 'layout';
    this.template = 'simple';

    this.data.flash = data.flash();

    var title = ''
    Object.defineProperty(this.data, 'title', {
        get: function() {
            return 'Candidate DB' + (title ? ' | ' + title : '');
        },
        set: function(val) {
            title = val;
        },
        configurable: true
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

    this.csrfInput = function() {
      return util.format(
        '<input type="hidden" name="_csrf" value="%s">', data.csrf);
    }
    this.renderForm = function(form) {
      return this.csrfInput() +
        form.toHTML(function(name, field) {
        return present.render('_formfield', {
          'classes': field.classes().join(' '),
          'label': field.labelText(name),
          'label-for': 'id_' + name,
          'widget': field.widget.toHTML(name, field),
          'error': field.error
        });
      })
    }
})
