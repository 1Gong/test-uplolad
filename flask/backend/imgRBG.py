import cv2
import numpy as np
from matplotlib import pyplot as plt


# 显示图片
def cv_show(name, img):
    cv2.imshow(name, img)
    cv2.waitKey()
    cv2.destroyAllWindows()


# plt显示彩色图片
def plt_show0(img):
    b, g, r = cv2.split(img)
    img = cv2.merge([r, g, b])
    plt.imshow(img)
    plt.show()


# plt显示灰度图片
def plt_show(img):
    plt.imshow(img, cmap='gray')
    plt.show()


def handlePic(filenaem):
    """
    filename : 图片路径
    return :
        image1:(轮廓检测的图片)
        colorbox:(每个样本中心点的像素值RGB)
    ret, image = cv2.threshold(gray_image, 200, 255, 0) #这个地方可以需要在改一改具体的阈值
    """
    im = cv2.imread(filenaem)
    # 高斯去噪
    image = cv2.GaussianBlur(im, (3, 3), 0)
    # 灰度处理
    gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    # 自适应阈值处理 0是黑,255是白
    ret, image = cv2.threshold(gray_image, 200, 255, 0) #这个地方可以需要在改一改具体的阈值
    # 轮廓检测
    contours, hierarchy = cv2.findContours(image, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    image1 = im.copy()
    cv2.drawContours(image1, contours, -1, (0, 255, 0), 5)
    # 筛选出各个字符的位置轮廓
    words = []
    for item in contours:
        # cv2.boundingRect用一个最小的矩形，把找到的形状包起来
        word = []
        rect = cv2.boundingRect(item)
        x = rect[0]
        y = rect[1]
        weight = rect[2]
        height = rect[3]
        word.append(x)
        word.append(y)
        word.append(weight)
        word.append(height)
        words.append(word)
    words = sorted(words, key=lambda s: s[0], reverse=False)  # s:s[0]表示从word[0]开始
    words = sorted(words, key=lambda s: s[1], reverse=False)  # s:s[0]表示从word[1]开始

    words = words[1::]
    #     print(words, type(words))

    colorbox = []  # 存储选择区域中心位置的像素值，可以用于回归
    for word in words:
        tmp = []
        x = word[1] + word[2] // 2
        y = word[0] + word[3] // 2
        tmp = [im[x, y, 2], im[x, y, 1], im[x, y, 0]]
        #         print(x, y, tmp) #输出维bgr --> rgb
        colorbox.append(tmp)

    return image1, colorbox, words


# image1, colorbox, colorloc = handlePic("static/srcImg/eb9c9c74-df88-11eb-be85-ac2b6e8aaf5b.jpg")
#
# print(colorbox)
# plt_show0(image1)