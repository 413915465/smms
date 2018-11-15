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
 router.post("/add",(req,res)=>{

    //接收数据
    let {cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount, goodsDetails,}=req.body;
    //sql语句，把获取到的数据添加到数据库
    let sqlstr="insert into goodstable(cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount, goodsDetails) values(?,?,?,?,?,?,?,?,?,?,?,?)"; 
    //参数数组
     let sqlarr=[cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount, goodsDetails,];
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
let sqlstr="select t1.*,t2.cg_name as fathername from categorygoods as t1 LEFT JOIN categorygoods as t2 on t1.cg_fatherID=t2.cg_id;";
//执行sql
connection.query(sqlstr,(err,data)=>{
    if(err) throw err;
    res.send(data);
})
});




router.get("/list",(req,res)=>{
     //sql语句
     let sqlstr="select * from goodstable";

  //执行sql语句
connection.query(sqlstr,(err,result)=>{
  if(err) throw err;
  res.send(result);
})
});








//删除

router.get("/del",(req,res)=>{
       //接收前端的数据
       let id=req.query.id;
       //sql构造
       let sqlstr="delete from goodstable where cg_id=?";
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



/
// 获取商品的分页的数据信息
router.get("/listPager",(req,res)=>{
  //接收页码和每页大小
  let {currentPage,pageSize}=req.query;
  
  //构造sql
  let sqlStr="select t1.*,t2.cg_name from goodsTable as t1 left join categorygoods as t2 on t1.cg_id=t2.cg_id";

  //执行全表sql查询：获取总的记录条数
  connection.query(sqlStr,(err,goodsList)=>{
     if(err) throw err;
     let total=goodsList.length; //总条数

     //定义分页参数数组
     let skip=(currentPage - 1)*pageSize; //跳过的条数
     let sqlParams=[skip,parseInt(pageSize)];
     sqlStr+=" limit ?,?";

     //执行查询当前页码应该显示的分页数据
     connection.query(sqlStr,sqlParams,(err,goodsPager)=>{
        if(err) throw err;
        res.send({"total":total,"datalist":goodsPager});
     });
  });
});



//根据查询的关键词和分类返回结果

 router.get("/listSearch",(req,res)=>{
   //接收关键词和分类
    let {keywords,category}=req.query;
    console.log(keywords,category);
    //构造sql
   let sqlStr="select t1.*,t2.cg_name from goodstable as t1 left join categorygoods as t2 on t1.cg_id=t2.cg_id where 1=1";
   
//关键词
   if(keywords.length>0){
      sqlStr+=` and (t1.barcode like '%${keywords}%' or t1.goodsname like '%${keywords}%')`;
   }

//    //分类
    if(category.length>0){
     sqlStr+=` and t1.cg_id=${category}`;
    }

//    //执行sql
    connection.query(sqlStr,(err,categoryList)=>{
      if(err) throw err;
       res.send(categoryList); //查询的结果
   });
 });
   












  



  





















module.exports = router;
