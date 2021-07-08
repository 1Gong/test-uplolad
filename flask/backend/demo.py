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

f = request.files['content']
basepath = os.path.dirname(__file__)  # 当前文件所在路径
src_imgname = str(uuid.uuid1()) + ".jpg"
upload_path = os.path.join(basepath, 'static/srcImg/')
print(upload_path, src_imgname)
if os.path.exists(upload_path) == False:
    os.makedirs(upload_path)
f.save(upload_path + src_imgname)
im = cv2.imread(upload_path + src_imgname, 1)  # 图片像素数据

# print(im, im.shape)
"""
image1:判断要检测的区域是否符合你的要求
resImg:最终判断出来的结果图
"""
# image1, colorbox, colorloc = imgRBG.handlePic(upload_path + src_imgname)
# resImg = LR.drawLR(colorbox, colorloc, im)
#
#
#
# save_path = os.path.join(basepath, 'static/resImg/')
# if os.path.exists(save_path) == False:
#     os.makedirs(save_path)
# save_imgname = str(uuid.uuid1()) + ".jpg"
# cv2.imwrite(save_path + save_imgname, im)