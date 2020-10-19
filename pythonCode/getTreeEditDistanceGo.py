from zss import simple_distance, Node
import json
import networkx as nx
import glob
from joblib import Parallel, delayed
from tqdm import tqdm

def getModel(path):
    data=json.load(open(path))
    edges=data['edges']
    name='0'
    newList = []
    data = {}
    for i in edges:
        if i[0] not in newList:
            newList.append(i[0])
        if i[1] not in newList:
            newList.append(i[1])

    for i in range(len(newList)):
        data[newList[i]] = Node(i)
    for edge in edges:
        data[edge[0]].addkid(data[edge[1]])
    if len(newList)==0:
        return Node(0)
    else:
        return data[0]

def dataset_reader(path):
    name = path.strip(".json").split("\\")[-1]
    data = json.load(open(path))
    edges=data['edges']
    return edges,name

def data_processing(path,model):
    edges,name=dataset_reader(path)
    newList = []
    data = {}
    distance = -1
    if int(name) != 0:
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
            distance = simple_distance(model, Node(0))+1
        else:
            distance=simple_distance(model,data[newList[0]])
    return {'name':name,'distance':distance}


def main(read_url,save_url):
    modelTree=getModel(read_url+'0.json')
    paths=glob.glob(read_url+"*.json")
    # print("reading data...")
    distances=Parallel(n_jobs=4)(delayed(data_processing)(path,modelTree) for path in tqdm(paths))
    # print(distances)
    with open(save_url,'w') as fw:
        json.dump(distances,fw)
        print("ok")

if __name__ == "__main__":
    main('./pythonCode/dataset2/','./pythonCode/features/distance.json')
    