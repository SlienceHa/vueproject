import json
from sklearn.manifold import TSNE
import  numpy as np
import sys
import io
from sklearn.cluster import DBSCAN
import itertools
def modiData(data):
    x1 = []
    x2=[]
    for i in range(0,len(data+1)):
        x1.append(data[i][0])
        x2.append(data[i][1])
    x1=np.array(x1)
    x2=np.array(x2)
    #重塑数据
    X=np.array(list(zip(x1,x2))).reshape(len(x1),2)
    return X
class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyEncoder, self).default(obj)

if __name__=="__main__":
    data = sys.argv[1].split(",")
    reTree=dict()
    show = []
    merge = [[]]
    for i in range(0,len(data)):
      if i%2==0:
        show.append(data[i])
      else:
        merge[0].append(int(data[i]))
    attr = []
    with open("att_5.json", "r") as f:
      attr = json.load(f)
    loc = []
    with open("location2.json", "r") as f:
      loc = json.load(f)
    for i in loc:
      temp=[]
      for j in show:
        temp.append(attr[i['id']][j])
      merge.append(temp)
    #merge完成交割线-------------------------------------------------------
    X_tsne = TSNE(n_components=2, learning_rate=100).fit_transform(merge)
    X_DBscan = modiData(X_tsne)
    DBscanData = DBSCAN(eps=2, min_samples=5, metric='euclidean').fit(X_DBscan)
    label = DBscanData.labels_.tolist()
    final = [{'id':'0','x':X_DBscan[0][0],'y': X_DBscan[0][1], 'cluster': label[0]}]
    for i in range(0, len(loc)):
      temp = {'id': loc[i]['id'], 'x': X_DBscan[i+1][0], 'y': X_DBscan[i+1][1], 'cluster': label[i+1]}
      final.append(temp)
    with open('static/attr/New.json', "w") as f:
      json.dump(final, f, cls=MyEncoder)
