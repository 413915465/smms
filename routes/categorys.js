//引入express模块
var express=require("express");

//调用路由
var router = express.Router();
 //引入mysql
 var mysql=require("mysql");
 //链接数据库
 var connection=mysql.createConnection({
 //链接的主机名
 host:"localhost",
 //用户名
 user:"root",
 //密码
 password:"root",
 port:"3306",
 //数据库的名字
 database:"smms"

 });

 //打开数据库
 connection.connect();

 //添加商品分类接收前端数据，并响应
 router.post("/addcategoy",(req,res)=>{
    //接收数据
    let {cg_fatherID,cg_name,cg_isLocked}=req.body;
    //sql语句，把获取到的数据添加到数据库
    let sqlstr="insert into categoryGoods(cg_fatherID,cg_name,cg_isLocked) values(?,?,?)"; 
    //参数数组
     let sqlarr=[cg_fatherID,cg_name,cg_isLocked];
     //执行sql语句
     connection.query(sqlstr,sqlarr,(err,result)=>{
       if(err) throw err;

       //反馈给前端的数据
       if(result.affectedRows>0){
        res.send({"Ok":true,"msg":"分类添加成功!"});
      }
      else{
        res.send({"Ok":false,"msg":"分类添加失败!"});
      }
   


     })


 });


//商品分类列表数据
router.get("/comolist",(req,res)=>{
   //构造sql
let sqlstr="select * from categoryGoods order by cg_id DESC";
//执行sql
connection.query(sqlstr,(err,data)=>{
    if(err) throw err;
    res.send(data);
})
});




//删除

router.get("/delcomo",(req,res)=>{
       //接收前端的数据
       let id=req.query.id;
       //sql构造
       let sqlstr="delete from categoryGoods where cg_id=?";
       //参数数组
       let sqlarr=[id];
       //执行sql语句
       connection.query(sqlstr,sqlarr,(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({"ok":true,"msg":"数据删除成功！"})
          }else{
            res.send({"ok":false,"msg":"数据删除成功！"})
          }
        })
})



















  



  





















module.exports = router;
