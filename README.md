# Mongo_Admin_Pannel

Mongo_Admin_Pannel is a Flask-based web application that provides a graphical user interface for performing CRUD (Create, Read, Update, Delete) operations on MongoDB databases. It allows users to manage their databases, collections, and documents effortlessly.

## Features

- **Connection Setup:**
  - Users can connect to MongoDB by providing a connection string, username, and password.
  - If no parameters are provided, the application defaults to the local MongoDB server.

- **Database Navigation:**
  - After connecting, users can view their databases and choose a specific database.
  - Collections within the selected database are displayed for further exploration.

- **Data Viewing:**
  - Users can view their data in both tabular and raw JSON formats.
  - Tabular format provides an easy-to-read representation of the documents.

- **Data Manipulation:**
  - CRUD operations can be performed on the documents.
  - Users can insert new data either in JSON or tabular format.
  - Documents can be deleted or updated seamlessly.

- **Collection and Database Management:**
  - Users can delete collections or entire databases with a single click.

- **Not Added:**
  - Creation of Databases
  - Creation of Collections  

## Usage

1. Clone the repository.
2. Install the required dependencies using `pip install -r requirements.txt`.
3. Run the Flask application: `python3 app.py`.
4. Open your web browser and navigate to [http://localhost:5500/](http://localhost:5000/).
5. Or You can Use the one hosted [By me](http://localhost:5000/)

## Docker Build 
```bash
sudo docker build -t mongoadmin .
```
```bash
sudo docker run -d --network=host mongoadmin
```

## Screenshots
  - ![Connection Page](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/ConnectionPage.png)
  - ![DataBase List](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/DataBaseList.png)
  - ![Collection List](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/CollectionList.png)
  - ![Data in Tabular Form](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/TabularData.png)
  - ![Data in JSON Form](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/JSONData.png)
  - ![Insert Tabular Data](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/InsertData.png)
  - ![Insert JSON Data](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/InsertJSON.png)
  - ![Update Data](https://github.com/dhimanparas20/Mongo-Admin-Pannel/blob/main/Screenshots/UpdateData.png)


## Contributing

Feel free to contribute to the project. Please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the [MIT License](LICENSE).

