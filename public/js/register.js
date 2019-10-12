var register_form = new Vue({
	el: '#register_form',
	data: {
		email: '',
		nickname: '',
		password: ''
	},
	methods: {
		// 异步提交表单，同步提交的话，返回的数据会直接覆盖当前页面
		post: function(e) {
			console.log(this.email)
			console.log(this.nickname)
			console.log(this.password)
			
			axios.post('/register', {
				email: this.email,
				nickname: this.nickname,
				password: this.password
			})
			.then(function(res) {
				if(res.status === 200) {
					if(res.data.success_code === 0) {
						alert('注册成功')
						// 重定向
						location.href = '/'
					} 
					else if(res.data.success_code === 1){
						alert('用户名或邮箱重复')
					}
				}
				else if(res.status === 500) {
					alert('系统繁忙：code=' + res.data.fail_code)
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