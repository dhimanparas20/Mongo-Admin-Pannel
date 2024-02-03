from pyMongo  import *

app = MongoDB("DemoDB4","Collection1")
data = {"name":"Nina",
        "age":69,
        "contact":8254,
        "hobbies":["Dancing","Cooking","Dating"],
        "history":{"h1":41,"h2":34,"h3":"foo-bar"}
}
app.insert(data)