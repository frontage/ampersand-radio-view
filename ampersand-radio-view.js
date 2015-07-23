var View = require('ampersand-view');
var InputView = require('ampersand-input-view');
var extend = require('lodash/object/assign'),

//an internally used view that is used to draw each radio button
var OneButton = View.extend({
	template:
		'<div><input type="radio" id=""><label data-hook="label"></label><span class="label" data-hook="text"></span></div>',
	props: {
		text: ['string', true, ''],
		checked: ['boolean', false, false],
		value: ['any', true],
		name: ['string', true],
		disabled: ['boolean', false, false],
		parent: 'state'
	},
	derived: {
		inputId: {
			deps: ['parent.name'],
			fn: function() {
				return this.parent.name + '-' + this.value;
			}
		}
	},
	bindings: {
		'inputId': [{
			type: 'attribute',
			selector: 'input',
			name: 'id'
		}, {
			type: 'attribute',
			selector: 'label',
			name: 'for'
		}],
		'text': {
			type: 'text',
			hook: 'text'
		},
		'checked': {
			type: 'booleanAttribute',
			selector: 'input',
			name: 'checked'
		},
		'value': {
			type: 'attribute',
			selector: 'input',
			name: 'value'
		},
		'name': {
			type: 'attribute',
			selector: 'input',
			name: 'name'
		},
		'disabled': {
			type: 'booleanAttribute',
			selector: 'input',
			name: 'disabled'
		}
	}
});

module.exports = InputView.extend({
	template: [
		'<div class="field field--radio">',
			'<div class="radio-buttons"></div>',
			'<input type="hidden" data-hook="main">',
			'<span class="label" data-hook="label"></span>',
			'<div data-hook="message-container" class="message message-below message-error">',
				'<p data-hook="message-text"></p>',
			'</div>',
		'</div>'
	].join(''),

	props: {
		buttons: 'array',
		extraClass: 'string'
	},

	bindings: extend({}, InputView.prototype.bindings, {
		'extraClass': {
			type: 'class'
		}
	}),

	initialize: function() {
		this.type = 'hidden';
		InputView.prototype.initialize.apply( this );
	},

	render: function () {
		InputView.prototype.render.apply( this );
		for ( var i = 0; i < this.buttons.length; i++ ){
			this.renderSubview( new OneButton({
				text: this.buttons[i].text,
				value: this.buttons[i].value,
				checked: this.buttons[i].checked,
				disabled: this.buttons[i].disabled,
				name: this.name + '-doNotUseDirectly',
				parent: this
			}), '.radio-buttons');
			if ( this.buttons[i].checked ) {
				this.inputValue = this.buttons[i].value;
			}
		}
	},

	events: extend({}, InputView.prototype.events, {
		'click input[type=radio]': '_radioClickHandler'
	}),

	_radioClickHandler: function(e) {
		this.inputValue = e.target.value;
	}
});