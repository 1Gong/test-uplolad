# # coding=utf8
# import sys
# defaultencoding = 'utf-8'
# if sys.getdefaultencoding() != defaultencoding:
#     reload(sys)
#     sys.setdefaultencoding(defaultencoding)
# from flask import Flask,render_template,request,json
# from DB import *
# app = Flask(__name__)
# @app.route('/')
# def hello_world():
#     return render_template('index.html')
# @app.route('/score',methods=['POST'])
# def score():
#     in_acc_nbr = str(json.loads(request.values.get("acc_nbr")))
#     input_grade1=int(json.loads(request.values.get("grade1")))
#     input_grade2 = int(json.loads(request.values.get("grade2")))
#     input_grade3 = int(json.loads(request.values.get("grade3")))
#     input_txt1=str(json.loads(request.values.get("txt1")))
#     input_txt2=str(json.loads(request.values.get("txt2")))
#     input_txt3=str(json.loads(request.values.get("txt3")))
#     score_db=db('mysql数据库ip地址',3306,'数据库用户名','数据库密码','数据库','utf8')
#     conn=score_db.connect_db()
#     cursor=conn.cursor()
#     sql=''' insert into grade (acc_nbr,grade1,grade2,grade3,txt1,txt2,txt3,insert_time) values (%s,%s,%s,%s,'%s','%s','%s',now())
#     '''%(in_acc_nbr,input_grade1,input_grade2,input_grade3,input_txt1,input_txt2,input_txt3)
#     cursor.execute(sql)
#     res=cursor.rowcount
#     conn.commit()
#     cursor.close()
#     conn.close()
#     if res==1:
#         # print res
#         res='数据提交成功'
#         return json.dumps(res.decode('utf8'))
#     else:
#         print res
#         res='数据提交失败'
#         return json.dumps(res.decode('utf8'))
# if __name__ == '__main__':
#     app.run(debug=True)