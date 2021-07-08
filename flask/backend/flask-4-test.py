from flask import Flask
from flask import request
import flaskest1
import json
import os
import uuid
import cv2
import imgRBG
import LR
from matplotlib import pyplot as plt


app = Flask(__name__)



@app.route("/")
def index():
    return "你好啊,首页!"


resSets = {}


@app.route('/postdata', methods=['POST'])
def postdata():
    f = request.files['content']
    # print("f", f)
    user_input = request.form.get("name")
    basepath = os.path.dirname(__file__)  # 当前文件所在路径
    # print("basepath", basepath)

    src_imgname = str(uuid.uuid1()) + ".jpg"
    # print("src_imgname", src_imgname)

    upload_path = os.path.join(basepath, 'static/srcImg/')
    # print(upload_path, src_imgname)

    if os.path.exists(upload_path) == False:
        os.makedirs(upload_path)
    f.save(upload_path + src_imgname)
    im = cv2.imread(upload_path + src_imgname, 1) #图片像素数据
    # print(im, im.shape)

    """
    image1:判断要检测的区域是否符合你的要求
    resImg:最终判断出来的结果图
    """
    image1, colorbox, colorloc = imgRBG.handlePic(upload_path + src_imgname)
    resImg = LR.drawLR(colorbox, colorloc, im)

    save_path = os.path.join(basepath, 'static/resImg/')
    if os.path.exists(save_path) == False:
        os.makedirs(save_path)
    # 返回三张图片原图，选择图，结果图
    save_imgname = str(uuid.uuid1()) + ".jpg"
    # print("save_imgname ",save_imgname)
    cv2.imwrite(save_path + save_imgname, im)

    save_Img1 = str(uuid.uuid1()) + ".jpg"
    cv2.imwrite(save_path + save_Img1, image1)

    save_resImg = str(uuid.uuid1()) + ".jpg"
    cv2.imwrite(save_path + save_resImg, resImg)


    #返回给微信小程序的内容
    resSets["value"] = flaskest1.process()
    resSets["resurl"] = "http://127.0.0.1:8989" + '/static/resImg/' + save_imgname
    resSets["resurl1"] = "http://127.0.0.1:8989" + '/static/resImg/' + save_Img1
    resSets["resurl2"] = "http://127.0.0.1:8989" + '/static/resImg/' + save_resImg
    #返回json格式数据
    return json.dumps(resSets, ensure_ascii=False)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8989)
