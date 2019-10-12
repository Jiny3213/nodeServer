var register_form = new Vue({
	el: '#login_form',
	data: {
		email: '',
		password: ''
	},
	methods: {
		// 异步提交表单，同步提交的话，返回的数据会直接覆盖当前页面
		post: function(e) {
			console.log(this.email)
			console.log(this.password)
			
			axios.post('/login', {
				email: this.email,
				password: this.password
			})
			.then(function(res) {
				if(res.status === 200) {
					if(res.data.success_code === 0) {
						alert('登录成功')
						// 重定向
						location.href = '/'
					} 
					else if(res.data.success_code === 1){
						alert('邮箱或密码错误，请重试')
					}
				}
				else if(res.status === 500) {
					alert('系统繁忙,请稍后再试')
				}
				else {
					alert('发生未知错误')
				}
			})
			.catch(function(err) {
				console.log(err)
			})
		}
	}
})