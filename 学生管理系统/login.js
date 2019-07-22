

var http=require('http');
var querystring=require('querystring');

var server=http.createServer(function (req,res) {
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:63342');
    res.setHeader('Access-Control-Allow-Credentials','true');//允许跨域发送cookie
    var post='';
    req.on('data',function (chunk) {
        post +=chunk;
        post =querystring.parse(post);
        //console.log(post);
    });
    req.on('end',function () {
        var date=new Date();
        date.setTime(date.getTime()+60*60*1000);
        //将输入数据和数据库对比，对比上了就把数据放入下条

        var MongoClient=require('mongodb').MongoClient;
        var mongoUrl="mongodb://admin:123456@127.0.0.1:27017/admin";
        MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
            if(err) return console.error(err);
            var dbase=db.db("stuServer");

//*******************教师登录验证***************************************************
            //这里执行教师的查询
            if(post.radioStatu==0){
                var whereStr={tno:post.username};
                dbase.collection('teacherNum').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }

                    if(result.length==0){

                        res.end('false');
                    }
                  if(result.length>0){
                      if(post.username==result[0].tno){
                          //如果户名密码都相等
                          if(post.password==result[0].pwd){
                              res.setHeader("Set-Cookie",'data={"tno" : '+result[0].tno+', "pwd" : '+result[0].pwd+' };expires='+date.toGMTString());
                              res.end('true');
                          }else {
                              res.end('false2');
                          }
                      }

                  }
                    db.close();
                })
            }
//******************这里执行学生的信息录入***************************************
            if(post.buttonStatu==1){

                if(post.sno!==''&&post.sname!==''&&post.sage!==''&&post.ssex!==''&&post.dept!==''&&post.sclass!==''&&post.spwd!==''){
                    var whereStr={sno:post.sno};
                    dbase.collection('studentInformation').find(whereStr).toArray(function (err,result) {
                        if(err){
                            throw  err;
                        }

                        if(result.length==0){
                            //这里执行录入数据的函数***********

                            var data={sno:post.sno,sname:post.sname,sage:post.sage,ssex:post.ssex,dept:post.dept,sclass:post.sclass,spwd:post.spwd};
                            dbase.collection('studentInformation').insertOne(data,function (err,res) {
                                if(err) throw err;
                                console.log("插入成功");
                                db.close();
                            });
                            res.end('infoSuccess');

                        }
                        if(result.length>0){

                            //学号存在
                            if(post.sno==result[0].sno){
                                //var a=JSON.stringify(result[0]);

                                //传一个已存在的信号
                                res.end('already');


                            }

                        }
                        db.close();
                    })
                }else {
                    res.end('havenull')
                }

            }
//*************************这里执行学生信息查询**********************************
            if(post.buttonStatu==2){
                var whereStr={sno:post.sno};
                dbase.collection('studentInformation').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }


                    //console.log(result[0]);


                    if(result.length==0){

                        res.end('nofind');
                    }
                    if(result.length>0){
                        var a=JSON.stringify(result[0])

                        res.end(a);
                    }
                    db.close();
                })
            }
//*************************这里执行学生信息修改**********************************
            if(post.buttonStatu==3){
                if(post.sno!==''&&post.sname!==''&&post.sage!==''&&post.ssex!==''&&post.dept!==''&&post.sclass!==''&&post.spwd!==''){
                    var whereStr={sno:post.sno};
                    dbase.collection('studentInformation').find(whereStr).toArray(function (err,result) {
                        if(err){
                            throw  err;
                        }

                        if(result.length==0){
                            res.end('nouser');
                        }
                        if(result.length>0){

                            //学号存在,执行更新语句

                            if(post.sno==result[0].sno){
                                var whereStr={sno:post.sno};
                                var updateStr={$set:{sname:post.sname,sage:post.sage,ssex:post.ssex,dept:post.dept,sclass:post.sclass,spwd:post.spwd}};
                                dbase.collection('studentInformation').updateOne(whereStr,updateStr,function (err,res) {
                                    if(err) throw err;
                                    db.close();
                                })
                                res.end('updateSuccess')
                            }

                        }
                        db.close();
                    })
                }else {
                    res.end('havenull')
                }

            }
//******************这里执行课程的信息录入***************************************
            if(post.buttonStatu==4){
                if(post.cno!==''&&post.cname!==''&&post.tno!==''&&post.credit!==''){
                    var whereStr={cno:post.cno};
                    dbase.collection('classInformation').find(whereStr).toArray(function (err,result) {
                        if(err){
                            throw  err;
                        }

                        if(result.length==0){
                            //这里执行录入数据的函数***********
                            console.log(post);
                            var data={cno:post.cno,cname:post.cname,tno:post.tno,credit:post.credit};
                            dbase.collection('classInformation').insertOne(data,function (err,res) {
                                if(err) throw err;
                                console.log("插入成功");
                                db.close();
                            });
                            res.end('infoSuccess');

                        }
                        if(result.length>0){

                            //课程号存在
                            if(post.cno==result[0].cno){
                                res.end('snoAlready');
                            }

                        }
                        db.close();
                    })
                }else {
                    res.end('havenull')
                }

            }
//*************************这里执行课程信息查询**********************************
            if(post.buttonStatu==5){
                var whereStr={cno:post.cno};
                dbase.collection('classInformation').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }

                    if(result.length==0){

                        res.end('nofind');
                    }
                    if(result.length>0){
                        var a=JSON.stringify(result[0])

                        res.end(a);
                    }
                    db.close();
                })
            }
//*************************这里执行课程信息修改**********************************
            if(post.buttonStatu==6){
                if(post.cno!==''&&post.cname!==''&&post.tno!==''&&post.credit!==''){
                    var whereStr={cno:post.cno};
                    dbase.collection('classInformation').find(whereStr).toArray(function (err,result) {
                        if(err){
                            throw  err;
                        }

                        if(result.length==0){
                            res.end('nouser');
                        }
                        if(result.length>0){

                            //课程号存在,执行更新语句

                            if(post.cno==result[0].cno){
                                var whereStr={cno:post.cno};
                                var updateStr={$set:{cname:post.cname,tno:post.tno,credit:post.credit}};
                                dbase.collection('classInformation').updateOne(whereStr,updateStr,function (err,res) {
                                    if(err) throw err;
                                    db.close();
                                })
                                res.end('updateSuccess')
                            }

                        }
                        db.close();
                    })
                }else {
                    res.end('havenull')
                }

            }
//*******************学生登录验证***************************************************
            if(post.radioStatu==1){

                var whereStr={sno:post.username};
                dbase.collection('studentInformation').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }

                    if(result.length==0){

                        res.end('false');
                    }
                    if(result.length>0){
                        if(post.username==result[0].sno){
                            //如果户名密码都相等
                            if(post.password==result[0].spwd){
                                res.setHeader("Set-Cookie",'data={"tno" : '+result[0].sno+', "pwd" : '+result[0].spwd+' };expires='+date.toGMTString());
                                res.end('true');
                            }else {
                                res.end('false2');
                            }
                        }

                    }
                    db.close();
                })
            }
//*************************这里执行学生信息查询**********************************
            if(post.buttonStatu==21){
                var whereStr={sno:post.sno};
                dbase.collection('studentInformation').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }
                    //console.log(result[0]);
                        var a=JSON.stringify(result[0])

                        res.end(a);

                    db.close();
                })
            }
//*************************这里执行获取课程信息查询**********************************
            if(post.buttonStatu==22){
                dbase.collection('classInformation').find().toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }
                    //console.log(result[0]);
                    var a=JSON.stringify(result);

                    //console.log(a);
                    res.end(a);

                    db.close();
                })
            }
//******************这里执行选课信息录入***************************************
            if(post.buttonStatu==23){

                console.log(post);
                if(post.classarr!==''){
                    //这里判断是否存在数据，不存在则插入
                    var whereStr={sno:post.sno};
                    dbase.collection('studentMark').find(whereStr).toArray(function (err,result){
                        if(err){
                            throw  err;
                        }
                        if(result.length==0){
                               var ss = post.classarr.split(",");

                                               for(var i=0;i<ss.length;i++){

                                                   console.log(ss[i]);
                                                   //这里执行录入数据的函数***********
                                                   var data={sno:post.sno,cno:ss[i],grade:''};
                                                   dbase.collection('studentMark').insertOne(data,function (err,res) {
                                                       if(err) throw err;
                                                       console.log("插入成功");
                                                       db.close();
                                                   });
                                               }
                            res.end('infoSuccess');
                        }
                        if(result.length>0){
                            res.end('ishave');
                        }
                        db.close();
                    })
                }else {
                    res.end('isnull')
                }
            }
//*************************这里执行选课信息查询**********************************
            if(post.buttonStatu==24){
                var whereStr={sno:post.sno};
                dbase.collection('studentMark').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }

                    if(result.length==0){
                        var b=JSON.stringify('nofind');
                        res.end(b);

                    }
                    if(result.length>0){
                        var a=JSON.stringify(result);
                        res.end(a);
                    }
                    db.close();
                })
            }
//*************************这里执行选课成绩查询**********************************
            if(post.buttonStatu==25){
                var whereStr={sno:post.sno};
                dbase.collection('studentMark').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }

                    if(result.length==0){
                        var b=JSON.stringify('nofind');
                        res.end(b);

                    }
                    if(result.length>0){
                        var a=JSON.stringify(result);
                        res.end(a);
                    }
                    db.close();
                })
            }
//*************************这里执行录入成绩信息查询**********************************
            if(post.buttonStatu==7){
                console.log(post);
                var whereStr={sno:post.sno,cno:post.cno};
                dbase.collection('studentMark').find(whereStr).toArray(function (err,result) {
                    if(err){
                        throw  err;
                    }

                    if(result.length==0){

                        res.end('nofind');
                    }
                    if(result.length>0){
                        var a=JSON.stringify(result[0])

                        res.end(a);
                    }
                    db.close();
                })
            }
//******************这里执行成绩的信息录入***************************************
            if(post.buttonStatu==8){
                if(post.sno!==''&&post.cno!==''&&post.grade!==''){
                    var whereStr={sno:post.sno,cno:post.cno};
                    dbase.collection('studentMark').find(whereStr).toArray(function (err,result) {
                        if(err){
                            throw  err;
                        }
                        if(result[0].grade==''){
                            //这里执行录入数据的函数***********
                            var whereStr={sno:post.sno,cno:post.cno};
                            var updateStr={$set:{grade:post.grade}};
                            dbase.collection('studentMark').updateOne(whereStr,updateStr,function (err,res) {
                                if(err) throw err;
                                db.close();
                            })
                            res.end('infoSuccess');
                        }

                            //学号存在
                            if(result[0].grade!==''){
                                //var a=JSON.stringify(result[0]);

                                //传一个已存在的信号
                                res.end('already');
                            }

                        db.close();
                    })
                }else {
                    res.end('havenull')
                }
            }
//******************这里执行成绩的信息录入***************************************
            if(post.buttonStatu==9){
                if(post.sno!==''&&post.cno!==''&&post.grade!==''){
                    var whereStr={sno:post.sno,cno:post.cno};
                    dbase.collection('studentMark').find(whereStr).toArray(function (err,result) {
                        if(err){
                            throw  err;
                        }
                        if(result[0].grade==''){
                            res.end('noalready');
                        }


                        //存在
                        if(result[0].grade!==''){
                            //var a=JSON.stringify(result[0]);
                            var whereStr={sno:post.sno,cno:post.cno};
                            var updateStr={$set:{grade:post.grade}};
                            dbase.collection('studentMark').updateOne(whereStr,updateStr,function (err,res) {
                                if(err) throw err;
                                db.close();
                            })
                            res.end('infoSuccess');
                        }

                        db.close();
                    })
                }else {
                    res.end('havenull')
                }
            }


















        });

    })
}).listen(3010);