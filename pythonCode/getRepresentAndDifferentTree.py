import json
from zss import simple_distance, Node
import sys
import numpy as np

#读取类数据，并返回指定类的点
def getClusterNodes(read_url,cluster):
    data=json.load(open(read_url,'r'))[str(cluster)]
    return data

#读取所有树(edit edges)并获得指定类的树
def getClusterTrees(read_url,lists):
    dic={}
    data=json.load(open(read_url,'r'))
    for i in lists:
        dic[i]=data[i]
    return dic

def data_processing(treeEdges):
    allNode={}#保存转换后的Node
    for treeId in treeEdges:
        edges=treeEdges[treeId]
        newList = []
        data = {}
        distance = -1

        for i in edges:
            if i[0] not in newList:
                newList.append(i[0])
            if i[1] not in newList:
                newList.append(i[1])

        for i in range(len(newList)):
            data[newList[i]]=Node(i)
        for edge in edges:
            data[edge[0]].addkid(data[edge[1]])

        if len(newList)==0:
            allNode[treeId]=Node(0)
        else:
            allNode[treeId]=data[newList[0]]
    return allNode

def getRepresentTree(Nodes):
    dis_dic={}
    for i in Nodes:
        distanceSum=0
        for j in Nodes:
            distance=simple_distance(Nodes[i],Nodes[j])
            distanceSum+=distance
        dis_dic[i]=distanceSum
    id=sorted(dis_dic.items(),key=lambda x:x[1])[0][0]
    return id,Nodes[id]

def getDifferentTrees(Nodes,representNode):
    differentTrees=[]
    for i in Nodes:
        if simple_distance(Nodes[i],representNode)!=0:
            differentTrees.append(i)
    return differentTrees

def getRepresentTree2(Nodes):
    # print("正在寻找代表树")
    arr=[]#保存距离二维数组
    arr_index=[]#arr_index[0]=1表示id为1的树的index=0
    for i in Nodes:
        arr_i=[]
        arr_index.append(i)
        for j in Nodes:
            distance=simple_distance(Nodes[i],Nodes[j])
            arr_i.append(distance)
        arr.append(arr_i)
    arr=np.array(arr)
    arrSum_col=arr.sum(axis=1)#每一行求和
    idIndex=np.argwhere(arrSum_col==arrSum_col.min())[0][0]#和最小行行号
    # id=arr_index[idIndex]
    return idIndex,arr,arr_index

def getDifferentTrees2(idIndex,arr,arr_index):
    # print("正在分类")
    representArr=np.argwhere(arr[idIndex]==0)#与代表树相同的树index
    representSameNodes=[arr_index[i[0]] for i in representArr]#与代表树相同的树id
    representCount=representArr.size#与代表树相同的树的个数
    differentArr=np.argwhere(arr[idIndex]!=0)#与代表树不同的树的index
    #差异树去重并统计每一类的数量
    i=0
    arr_difTypes=[{'name':arr_index[idIndex],'sameNodes':representSameNodes,'count':representCount}]
    while i <= (differentArr.size-1):
        # print(str(i)+" "+str((differentArr.size-1)))
        count=1
        sameNodes=[]
        j=i
        while j <= (differentArr.size-1):
            # print("j:"+str(j)+" "+str((differentArr.size-1)))
            if i!=j and arr[differentArr[i][0],differentArr[j][0]]==0:
                count+=1
                sameNodes.append(arr_index[differentArr[j][0]])
                differentArr=np.delete(differentArr,j,axis=0)
                j-=1
            j+=1
        sameNodes.append(arr_index[differentArr[i][0]])
        arr_difTypes.append({'name':arr_index[differentArr[i][0]],'sameNodes':sameNodes,'count':count})
        i+=1
    return {'representTree':arr_index[idIndex],'types':arr_difTypes}

if __name__ == "__main__":
    cluster=sys.argv[1]
    Nodes=getClusterNodes('./pythonCode/features/Clusters.json',cluster)
    Trees=getClusterTrees('./pythonCode/features/editTrees.json',Nodes)
    allNodes=data_processing(Trees)
    # representTreeId,representNode=getRepresentTree(allNodes)
    # differentTrees=getDifferentTrees(allNodes,representNode)
    idIndex,arr,arr_index=getRepresentTree2(allNodes)
    data=getDifferentTrees2(idIndex,arr,arr_index)
    with open('./pythonCode/features/representAndDifferent.json','w') as fw:
        json.dump(data,fw)
    print("ok!")