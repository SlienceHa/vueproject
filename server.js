const express=require('express');
const bodyParser = require('body-parser');
const exec=require('child_process').exec;
const fs=require('fs');


const server=express();

server.use(bodyParser.urlencoded({ extended: false }))

server.use(bodyParser.json())

server.listen(5000,()=>{
    console.log("app running at 5000!");
})

const graph2vecRouter=express.Router();
const treeEditRouter=express.Router();
const clusterRouter=express.Router();



server.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept")
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
    });

server.use('/api/graph2vec',graph2vecRouter);
server.use('/api/treeEdit',treeEditRouter);
server.use('/api/cluster',clusterRouter);



server.post('/api/attr',(req,res)=>{
    let tree=req.body.data;
    exec('python ./reTree.py '+ tree,function(error,stdout,stderr){
        if(stdout.length >1){
            console.log(stdout)
            console.log("ok1!!!!!!!!!!!!!!!!!!!!!!!!!")
            res.send({"data":true})
        }
        else if(error){
            res.send({"data":false})
            console.log(error);
        }
        else {
            console.log('you don\'t offer args1');
            res.send({"data":false})
        }
        
    });

})

server.post('/api/search',(req,res)=>{
    let tree=req.body.data;
    let method=req.body.way;
    let exit=req.body.exit;
    let name=req.body.name;
    exec('python ./pythonCode/getModelTreeEdges.py '+ tree +' '+method+' '+exit+' '+name,function(error,stdout,stderr){
        if(stdout.length >1){
            console.log(stdout)
            console.log("ok1!")
            res.send({"data":true})
        }
        else if(error){
            console.log(error);
        }
        else {
            console.log('you don\'t offer args1');
            res.send({"data":false})
        }
        
    });

})
graph2vecRouter.post('/getAttr_5',(req,res)=>{
    let Attr = req.body.attr;
    exec('python ./pythoncode/getLocation_5.py'+Attr,function(error){
        res.send("ojbk");
    })
}),
graph2vecRouter.post('/graph2vec',(req,res)=>{
    exec('python ./pythonCode/getSimilaryTree.py ',function(error,stdout,stderr){
        if(stdout.length >1){
            console.log(stdout);
            res.send({"data":true})
        }
        else if(error){
            console.log(error);
        }
        else {
            console.log('you don\'t offer args 2');
            res.send({"data":false})
        }
        
    });
})
graph2vecRouter.post('/pipei',(req,res)=>{
    let count=Number(req.body.count);
    let modelVector=fs.readFileSync('./pythonCode/features/modelVectors.json');
    modelVector=JSON.parse(modelVector).vector;
    fs.readFile('./pythonCode/features/vectorChild.csv', function (err, data) {
        // var table = new Array();
        if (err) {
            console.log(err);
            return;
        }
    
        ConvertToTable(data, function (table) {
            let dic=[]
            for(var i=0;i<table.length;i++){
                dic.push({"name":table[i][0],"distance":getDistance(modelVector,table[i])});
            }
            dic.sort(function(a,b){
                return a.distance-b.distance;
            })
            res.send({"data":dic.slice(0,count)});
        })
        
    });
})


treeEditRouter.post('/treeEdit',(req,res)=>{
    exec('python ./pythonCode/getTreeEditDistanceGo.py ',function(error,stdout,stderr){
        if(stdout.length >1){
            console.log(stdout);
            res.send({"data":true})
        }
        else if(error){
            console.log(error);
        }
        else {
            console.log('you don\'t offer args 2');
            res.send({"data":false})
        }
        
    });
})

treeEditRouter.post('/getDistance',(req,res)=>{
    
    let count=Number(req.body.count);
    fs.readFile('./pythonCode/features/distance.json', function (err, data) {
        // var table = new Array();
        if (err) {
            console.log(err);
            return;
        }
        data=JSON.parse(data);
        data.sort((a,b)=>(a.distance-b.distance));
        res.send({"data":data.slice(1,count+1)});
    })
})

treeEditRouter.post('/getCloseDistance',(req,res)=>{
    
    fs.readFile('./pythonCode/features/distance.json', function (err, data) {
        // var table = new Array();
        if (err) {
            console.log(err);
            return;
        }
        data=JSON.parse(data);
        data.sort((a,b)=>(a.distance-b.distance));
        id=data[0].name;
        fs.readFile('./pythonCode/features/vectorChild.csv', function (err, data) {
            // var table = new Array();
            if (err) {
                console.log(err);
                return;
            }
        
            ConvertToTable(data,id, function (table,modelVerctor) {
                let dic=[]
                for(var i=0;i<table.length;i++){
                    dic.push({"name":table[i][0],"distance":getDistance(modelVector,table[i])});
                }
                dic.sort(function(a,b){
                    return a.distance-b.distance;
                })
                res.send({"data":dic.slice(0,count)});
            })
            
        });
    })
})

clusterRouter.post('/dopython',(req,res)=>{
    let cluster=req.body.cluster;
    exec('python ./pythonCode/getRepresentAndDifferentTree.py '+ cluster,function(error,stdout,stderr){
        if(stdout.length >1){
            console.log(stdout);
            res.send({"data":true})
        }
        else if(error){
            console.log(error);
        }
        else {
            console.log('you don\'t offer args 2');
            res.send({"data":false})
        }
        
    });
})
clusterRouter.post('/getRandD',(req,res)=>{
    fs.readFile('./pythonCode/features/representAndDifferent.json', function (err, data) {
        // var table = new Array();
        if (err) {
            console.log(err);
            return;
        }
        data=JSON.parse(data);
        data.types.sort((a,b)=>(b.count-a.count));
        res.send({data:data});
    })
})

function getDistance(list1,list2){
    let sum=0;
    for(var i=1;i<list1.length;i++){
        sum+=Math.pow((list1[i-1]-list2[i]),2);
    }
    return Math.sqrt(sum);
}

function ConvertToTable(data, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    rows = data.split("\r\n");
    for (var i = 1; i < rows.length-1; i++) {
        if(i>0)
            table.push(rows[i].split(","));
    }
    callBack(table);
}

function ConvertToTable2(data,modelId, callBack) {
    data = data.toString();
    var table = new Array();
    var rows = new Array();
    var modelVerctor=[];
    rows = data.split("\r\n");
    for (var i = 1; i < rows.length-1; i++) {
        if(i>0){
            table.push(rows[i].split(","));
            if(rows[i].split(",")[0]==modelId){
                modelVerctor=rows[i].split(",");
            }
            
        }
    }
    callBack(table,modelVerctor);
}