import json
from sklearn.manifold import TSNE
import sys
import numpy as np
if __name__=="__main__":
  attrs=dict()
  origin=dict()
  with open("./features/att_5.json","r") as f:
    attrs = json.load(f)
  with open("../static/location2.json","r") as f:
    origin = json.load(f)

  attr = sys.argv[1]
  # attr = ['Structure','positionNum']
  temp_attr=[]

  for i in origin:
    temp=[]
    for j in attr:
      if j == "Structure":
        temp.append(i['x'])
        temp.append(i['y'])
      else:
        temp.append(attrs[i['id']][j])
    temp_attr.append(temp)
  X_tsne = TSNE(n_components=2, learning_rate=100).fit_transform(temp_attr)
  fianl=[]
  for i in range(0,len(X_tsne)):
    fianl.append({'id':origin[i]['id'],'x':X_tsne[i][0],'y':X_tsne[i][1],'cluster':origin[i]['cluster']})

  with open("../static/locationNew.json","w") as f:
    json.dump(str(fianl),f)



