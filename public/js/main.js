var header = new Vue({
	el: 'header',
	data: {
		display_user_li: 'none'
	},
	methods: {
		show_user_li: function() {
			this.display_user_li = 'block'
		},
		hide_user_li: function() {
			this.display_user_li = 'none'
		}
	}
})