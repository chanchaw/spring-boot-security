import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = "测试 spring-boot-security-permission";
  validateForm: FormGroup;

  url = {
    'login':'apidata/login',
    'getUser':'apidata/selectSpeUsers'
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const username:string = this.validateForm.controls.userName.value
    const password:string = this.validateForm.controls.password.value;
    console.log(username +'='+password);
    this.http.post(this.url.login,{ 'username': username,'password':password }).subscribe(
      ( jr:JsonResult ) => console.log(jr),error => console.log('登录失败！')
    )
  }

  constructor(private fb: FormBuilder,private http:HttpClient) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }


  getUser(){
    this.http.get(this.url.getUser).subscribe(
      ( jr:JsonResult ) =>{
        console.log(jr);
      },error => console.log('请求获取用户信息时出现异常！')
    )
  }
}


export class JsonResult{
  code:number;
  msg:string;
  data:any;

  static getError(msg:string = '验证未通过，操作被中断！'):JsonResult{
      let ret = new JsonResult();
      ret.code = -1;
      ret.msg = msg;
      ret.data = null;

      return ret;
  }

  constructor(data?:any){
      this.code = 1;
      this.data = data;
  }
}
