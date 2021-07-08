import json
from flask import Flask, request

app = Flask(__name__)


# status code 200 500 401 404 ......
# 首页
@app.route('/')  # 接口地址
def index():
    # 接口本身
    dict_info = {"msg": "首页"}
    # 字典形式转化为json
    json_info = json.dumps(dict_info)  # 导入json
    return json_info, 202, {"content-type": "application/json"}  # 这里新增定义的status code


# 登录页
@app.route('/login')  # 接口地址
def login():
    # 接口本身
    # 接收请求数据
    username = request.args.get('username')
    pwd = request.args.get('pwd')
    return json.dumps({"username": username, "pwd": pwd}), 202, {"content-type": "application/json"}


# web 服务器
if __name__ == '__main__':
    app.run()