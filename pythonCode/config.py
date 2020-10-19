class config():
    urlOriginalData="../OriginalData/"
    urlNeedData="../Data/"
    url2vec="./dataset/"
    url2vec2 = "./dataset2/"
    urlvector="./features/"
    dataOriginalDataName="27063-0001-Data.txt"
    dataOriginalDataName2="Data.txt"
    dataOriginalWordLocationName="word_location.csv"
    dataNeedDataName="personInfo.json"
    dataNeedDataName2="personInfo2.json"
    dataChildrenName="personChildren.json"
    dataChildrenName2 = "personChildren2.json"
    dataRootsName="roots.json"
    dataRootsName2 = "roots2.json"
    dataTreesName="trees.json"
    dataTreesName2 = "trees2.json"
    dataVectorsName="vector.csv"
    dataVectorsName2 = "vector2.csv"
    dataLoctionName="location.json"
    dataLoctionName2 = "location2.json"
    needIndexArray=[2,3,4,6,8,9,10,21,24,25]
    personIdIndex=2
    needWordName=['person_id','mother_id','father_id','wife_1_id','wife_2_id',
                  'husband_id','sex','age_in_sui','birthyear','son_count','founder_id']


import argparse


def parser():
    """
    A method to parse up command line parameters. By default it gives an embedding of the partial NCI1 graph dataset.
    The default hyperparameters give a good quality representation without grid search.
    Representations are sorted by ID.
    """
    parser = argparse.ArgumentParser(description="Run Graph2Vec.")

    parser.add_argument("--input-path",
                        nargs="?",
                        default="./pythonCode/dataset/",
                        help="Input folder with jsons.")

    parser.add_argument("--output-path",
                        nargs="?",
                        default="./pythonCode/features/vector.csv",
                        help="Embeddings path.")

    parser.add_argument("--dimensions",
                        type=int,
                        default=128,
                        help="Number of dimensions. Default is 128.")

    parser.add_argument("--workers",
                        type=int,
                        default=10,
                        help="Number of workers. Default is 4.")

    parser.add_argument("--epochs",
                        type=int,
                        default=100,
                        help="Number of epochs. Default is 10.")

    parser.add_argument("--min-count",
                        type=int,
                        default=5,
                        help="Minimal structural feature count. Default is 5.")

    parser.add_argument("--wl-iterations",
                        type=int,
                        default=2,
                        help="Number of Weisfeiler-Lehman iterations. Default is 2.")

    parser.add_argument("--learning-rate",
                        type=float,
                        default=0.025,
                        help="Initial learning rate. Default is 0.025.")

    parser.add_argument("--down-sampling",
                        type=float,
                        default=0.0001,
                        help="Down sampling rate for frequent features. Default is 0.0001.")

    return parser.parse_args()
