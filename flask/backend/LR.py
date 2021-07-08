import cv2
import numpy as np
from matplotlib import pyplot as plt


# plt显示彩色图片
def plt_show0(img):
    b, g, r = cv2.split(img)
    img = cv2.merge([r, g, b])
    plt.imshow(img)
    plt.show()

def drawLR(colorbox, colorloc, im):
    """
    模型公式
    y = 2.0268066896173527 - 0.0040421 * rgb[0] - 0.01122681 * rgb[1] + 0.00526391 * rgb[2]
    参数:
        colorbox:提取的中心位置像素
        colorloc:颜色区域的位置信息
        im:图像
    return:
        返回经过回归模型之后的图片
    """
    # 回归模型
    for rgb,loc in zip(colorbox, colorloc):
        y = 2.0268066896173527 - 0.0040421 * rgb[0] - 0.01122681 * rgb[1] + 0.00526391 * rgb[2] #模型
        if y < 0.9:
            cv2.rectangle(im, pt1=(loc[0], loc[1]), pt2=(loc[0]+loc[2], loc[1]+loc[3]), color=(0, 0, 0), thickness=3)

    # plt_show0(im)
    return im