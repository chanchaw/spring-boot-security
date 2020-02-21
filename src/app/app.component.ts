import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    'getUser':'apidata/selectSpeUsers',
    'selectAll':'apidata/contactCompany/selectAll',
    'insert':'apidata/contactCompany/insert'
  }
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    const username:string = this.validateForm.controls.userName.value;
    const password:string = this.validateForm.controls.password.value;
    console.log(username +'='+password);
    
    // 不能经验主义，本案例在2020年2月21日15:20:33制作
    // 以前做过 springSecurity 的案例，采用的是post 方法时，参数在体中传递
    // 此次一开始沿用之前的方法，后端一直接受不到登录的参数
    // 后来网上搜索到说是拼接到 url 后传递，果然成功。
    const url:string = this.url.login + '?username=' + username + '&password=' + password;
    this.http.post(url,null).subscribe(
    ( jr:JsonResult ) => console.log(jr),error => console.log('登录失败！')
  )

    // let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8' });
    // this.http.post('apidata/login',
    //   {'headers':headers,'params':{'username':username,'password':password}}).subscribe(
    //   ( jr:JsonResult ) => console.log(jr),error => console.log('登录失败！')
    // )
  }

  constructor(
    private fb: FormBuilder,
    public http:HttpClient) {}

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

  clickSelectAll(){
    this.http.get(this.url.selectAll).subscribe(
      ( jr:JsonResult ) =>{
        if( jr.code !==1 ){
          alert(jr.msg);
          return 
        }

        alert('查询成功！');
      },error => console.log(error)
    )

  }

  clickInsert(){
    this.http.get(this.url.insert).subscribe(
      ( jr:JsonResult ) =>{
        if( jr.code !==1 ){
          alert(jr.msg);
          return 
        }

        alert('新增成功！');
      },error => console.log(error)
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
