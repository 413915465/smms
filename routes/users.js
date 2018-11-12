//引入express模块

var express = require('express');
//调用路由
var router = express.Router();
 //引入crypto模块，对密码进行加密
 var md5=require("crypto");


// 引入mysql
var mysql = require("mysql");
//链接数据库
var connection = mysql.createConnection({
  host: "localhost",   //链接的主机名
  user: "root",    //用户名
  password: "root",   //密码
  prot: "3306",
  database: "smms"   //链接到的数据库
});
//打开数据库
connection.connect();


//链接添加管理员账号的路由
router.post('/addadmin', function (req, res, ) {
  //接收前端传送的数据
  //解构
  let { pass, usename, region } = req.body;
   //对密码进行md5加密
   pass=md5.createHash("md5").update(pass).digest("hex");
 
 //链接数据库，将数据写入数据库
  //定义SQL语句方式一
  // let sqldata=`insert into addamintable(username,passworld,usergroud) values('${usename}','${pass}','${region}')`;

  //定义sql语句方式二
  let sqlstr = "insert into addamintable(username,passworld,usergroud) values(?,?,?)";
  //定义参数数组
  let sqlarr = [usename, pass, region];

 //执行sql语句
  connection.query(sqlstr, sqlarr, function (err, result) {
    //判断
      if (err) {
        res.send({"ok":false,"msg":"数据添加失败!"})
        
      } else {
        res.send({"ok":true,"msg":"数据添加成功!"})
      }

   
  });
});

//接收账号管理页面的请求
router.get("/list",(req,res)=>{

  //sql语句,查询数据，
  let sqldata="select * from  addamintable order by u_id ASC ";

  //执行sql语句
  connection.query(sqldata,(err,result)=>{
      if (err) throw err;
      res.send(result);
    });    
  });    


//接收删除数据的请求
router.get("/del",(req,res)=>{
   
  //接收前端传过来的数据
  let id=req.query.id;
  //sql语句
  let sqlstr="delete from addamintable where u_id=?";
  //参数数组
  let sqlarr=[id];

  //执行sql语句
  connection.query(sqlstr,sqlarr,(err,result)=>{
    //判断,如果出错就抛出错误
    if (err) throw err;
     //affectedRows   数据受影响的行数，如果大于0，就说名成功
    if(result.affectedRows>0){
      res.send({"ok":true,"msg":"数据删除成功！"})
    }else{
      res.send({"ok":false,"msg":"数据删除成功！"})
    }
  })   
});    


//编辑页面,根据id获取数据
 router.get("/getuseId",(req,res)=>{
    //获取参数id
      let id=req.query.id;

      //sql语句
      let sqlstr="select * from  addamintable where u_id=?";
       //参数数组
      let sqlarr=[id];
      //执行sql语句
      connection.query(sqlstr,sqlarr,(err,result)=>{
        if(err) throw err;
        //将查询到的结果返回给前端29
    
        res.send(result);
      })
    });

 //接收新的数据并将新的数据追加到数据
router.post("/save",(req,res)=>{
       //接收前端传过来的数据
       //解构
       let {pass,usename,region,u_id, oldPwd} =req.body;
       let newpass=pass;
    //md5加密。判断，如果新的密码和原来的密码不一致，就加密
     if(oldPwd!=newpass){
      pass=md5.createHash("md5").update(pass).digest("hex");
     }
     
      //sql语句
      let sqlstr="update addamintable set passworld=?,username=?,usergroud=? where u_id=?"
      //参数数组
      let sqlarr=[pass,usename,region,u_id]
      //执行sql 语句
      connection.query(sqlstr,sqlarr,(err,result)=>{
        if(err) throw err;
        if (result.affectedRows>0)
         {
            res.send({"ok":true,"msg":"修改成功"});
        } else {
          res.send({"ok":false,"msg":"修改失败"});
        }
      })
   
    });

//登陆页面接收数据
router.post("/sigin",(req,res)=>{
    //接收前端传来数据
    let {username,checkPass}=req.body;
     //对密码进行md5加密
     checkPass=md5.createHash("md5").update(checkPass).digest("hex");
     //定义sql语句
     let sqlstr="select u_id from addamintable where username=? and passworld=?";
     //参数数组
     let sqlarr=[username,checkPass];
    //执行sql语句
     connection.query(sqlstr,sqlarr,(err,result)=>{
         if(err) throw err;
         //判断  ,result的值返回的是一个对象数组
         if(result.length>0){
          //登陆成功后  创建cookie
          res.cookie("username",username);
          res.cookie("u_id",result[0].u_id);
           res.send({"ok":true,"msg":"登陆成功"})
         }else{
            res.send({"ok":false,"msg":"登陆失败"})
         }
        
     });
    });   

//退出登陆清除cookie
router.get("/singout",(req,res)=>{
  //退出登陆。就清除cookie
  res.clearCookie("username");
  res.clearCookie("u_id");
  //并且跳转到登陆页面
  res.redirect("/login.html");
 });


 //验证身份的合法性，有cookie就合法
 router.get("/IFcook",(req,res)=>{
    //使用cookie
  let username= req.cookies.username;
  //判断，如果，有cookie就是合法的，没有就是非法的，非法就退出到登陆页面
  if(username==null){
    res.send("alert('您的登陆是非法的,请登录');location.href='login.html';")
  }else{
     res.send("");
  }




 });




  



  





















module.exports = router;
