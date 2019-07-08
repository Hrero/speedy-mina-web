Component({
	properties: {
		text: {
			type: String,
			value: '温馨提示'
        }
	},
	data: {
	},
	attached() {
	},
	ready() {
	},
	methods: {
        onCloseBtn() {
            this.triggerEvent('onCloseBtn')
        }
	}
})