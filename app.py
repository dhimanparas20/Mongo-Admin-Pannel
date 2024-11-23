from flask import Flask, render_template,make_response,request, session, redirect, url_for,current_app,jsonify
from flask_restful import Api, Resource
from flask_session import Session
import pyMongo
from os import environ,system,getcwd
import json
import random
system("clear")
# system(f"rm -rf {getcwd()}/flask_session")

def generate_random_number():
    # Generate a random number between 10000 and 99999 (inclusive)
    return random.randint(10000, 99999)

app = Flask(__name__)
api = Api(app)
app.config['SESSION_TYPE'] = 'mongodb'
app.config['SECRET_KEY'] = "c365a380254da310e47c24a692dad2e8"
app.config['SESSION_PERMANENT'] = True #False -> session will expire when the browser is closed.
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
Session(app)
app.config['SESSION_USE_SIGNER'] = True  # adds a cryptographic signature to the session cookie 
app.config['SESSION_COOKIE_SECURE'] = False #ensures that the session cookie is only sent over HTTPS connections.
app.config['SESSION_MONGODB_DB'] = f"mongoSession{generate_random_number()}"
Session(app)

# Connect to DB
class Connect(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    
    def post(self):
        data = request.form.to_dict()
        string = "mongodb://localhost:27017/" if not data['string'] else data['string']
        if data['username'] and data['password']:
            string = f"mongodb+srv://{data['username']}:{data['password']}@databse.zcvt3f3.mongodb.net/?retryWrites=true&w=majority"  
        current_app.db = pyMongo.MongoDB(connectionStr=string)
        if current_app.db != False:
            session['id'] = pyMongo.genString()  # Store session data
            return redirect(url_for("home"))  # Redirect to the home page
        return {"msg": "Invalid Credentials or String"}  

#Shows List of Databases
class Home(Resource):
    def get(self):
        id = session.get('id')  # Fetch the session ID
        if id:  # If session ID exists
            databases = current_app.db.getAllDB()
            return make_response(render_template("dashboard.html", data=databases))
        return redirect(url_for("connect"))  # Redirect to connect if session is invalid

#Shows List of Collections inside a DB
class ShowCollections(Resource):
    def get(self):
        id = session.get('id')
        if id:
            data = request.args.to_dict()
            session['currentdatabase'] = data['dbname']
            collections = current_app.db.getAllCollection(db_name=data['dbname'])
            # return (collections)
            return make_response(render_template("collections.html",data=collections,db=data['dbname']))
        return redirect(url_for("connect"))       
#Shows data Inside A collection
class getData(Resource):
    def get(self):
        id = session.get('id')
        if id:
            data = request.args.to_dict()
            collection = data['collectionName']
            current_app.db.addDB(db_name=session.get('currentdatabase'),collection_name=collection)
            dbdata = current_app.db.fetch(show_id=True)
            allkeys = current_app.db.getKeys()
            try:
                return make_response(render_template("data.html", data=dbdata,keys=allkeys,db=session.get('currentdatabase'),collection=collection))
            except:
                data = [{"Message":"Invalid data Type or Unknown Error Occured"}]
                return make_response(render_template("data.html", data=data,keys=allkeys,db=session.get('currentdatabase'),collection=collection))
                
        return redirect(url_for("connect")) 
#Insert data to DB
class Insert(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    
    def post(self):
        id = session.get('id')
        if id:
            data = request.get_json()
            resp = current_app.db.insert(data)
            return (resp)
        return False
#Insert JSON to DB
class InsertJSON(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    
    def post(self):
        id = session.get('id')
        if id:
            data = request.get_json()
            resp = current_app.db.insert(data)
            return (resp)
        return False
#Modify data to DB
class Update(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    
    def post(self):
        id = session.get('id')
        if id:
            data = request.get_json()
            _id = data['_id']
            data.pop("_id", None)
            resp = current_app.db.update({"_id":_id},data)
            return (resp)
        return False
# Delete Data
class Delete(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    def post(self):
        id = session.get('id')
        if id:
            data = request.form.to_dict()
            resp = current_app.db.delete({"_id": data['id']})
            return resp  
        return False
# Delete Collection
class DeleteCollection(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    def post(self):
        id = session.get('id')
        if id:
            data = request.form.to_dict()
            resp = current_app.db.dropCollection(db_name=data['dbname'],collection_name=data['collectionname'])
            return (resp)
        return False
# Delete DB
class DeleteDB(Resource):
    def get(self):
        return make_response(render_template('connect.html'))
    def post(self):
        id = session.get('id')
        if id:
            data = request.form.to_dict()
            resp = current_app.db.dropDB(db_name=data['name'])
            return (resp)    
        return (False)    
#Logout
class Logout(Resource):
    def get(self):
      id = session.get('id')
      if 'id' in session:
        session.pop('id', None)  # Remove user_id from session
        return redirect(url_for("connect"))
      else:
        return redirect(url_for("connect")) 

api.add_resource(Home, '/')
api.add_resource(Connect, '/connect')
api.add_resource(ShowCollections, '/collection')
api.add_resource(Insert, '/insert')         #C
api.add_resource(InsertJSON, '/insertjson') #R
api.add_resource(getData, '/getdata')       #R
api.add_resource(Update, '/update')         #U
api.add_resource(Delete, '/delete')         #D
api.add_resource(DeleteCollection, '/deletecollection')
api.add_resource(DeleteDB, '/deletedb')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(debug=False,port=5500,host="0.0.0.0",threaded=True)
