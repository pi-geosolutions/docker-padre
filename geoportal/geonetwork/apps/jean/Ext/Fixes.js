Ext.form.TriggerField.prototype.initTrigger = Ext.form.TriggerField.prototype.initTrigger.createSequence(function () {
	if (!this.hideTrigger) {
		this.trigger.getWidth = Ext.Element.prototype.getComputedWidth;
	}

	if (!Ext.isIE) { //Safari, Firefox
		this.el.getWidth = Ext.Element.prototype.getComputedWidth;
	}
});

