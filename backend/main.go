package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	Routers()
}

func Routers() {
	InitDB()
	defer db.Close()
	router := mux.NewRouter()
	router.HandleFunc("/users", GetUsers).Methods("GET")
	router.HandleFunc("/users", CreateUser).Methods("POST")
	router.HandleFunc("/users/{id}", GetUser).Methods("GET")
	router.HandleFunc("/users/{id}", UpdateUser).Methods("PUT")
	router.HandleFunc("/users/{id}", DeleteUser).Methods("DELETE")
	fmt.Println("Server running at 3030")
	if err := http.ListenAndServe(":3030", &CORSRouterDecorator{router}); err != nil {
		log.Fatal(err)
	}
}

type User struct {
	ID          int    `json:"id"`
	FirstName   string `json:"first_name"`
	MiddleName  string `json:"middle_name"`
	LastName    string `json:"last_name"`
	Email       string `json:"email"`
	Gender      string `json:"gender"`
	CivilStatus string `json:"civil_status"`
	Birthday    string `json:"birthday"`
	Contact     string `json:"contact"`
	Address     string `json:"address"`
}

func GetUsers(wr http.ResponseWriter, req *http.Request) {
	wr.Header().Set("Content-Type", "application/json")

	var users []User
	rows, err := db.Query("SELECT * FROM users")

	if err != nil {
		log.Fatal(err)
		http.Error(wr, err.Error(), 500)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.FirstName, &user.MiddleName, &user.LastName, &user.Email, &user.Gender, &user.CivilStatus, &user.Birthday, &user.Contact, &user.Address)
		if err != nil {
			log.Fatal(err)
			http.Error(wr, err.Error(), http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}
	json.NewEncoder(wr).Encode(users)
}

func CreateUser(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("CreateUser")
}

func GetUser(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("GetUser")
}

func UpdateUser(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("UpdateUser")
}

func DeleteUser(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("DeleteUser")
}

func InitDB() {
	// Below is the connection string in format
	// "username:password@protocol(host:port)/dbname"
	db, err = sql.Open("mysql", "root@tcp(localhost:3306)/userdb")
	if err != nil {
		panic(err.Error())
	}
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to the database")
}

var db *sql.DB
var err error

type CORSRouterDecorator struct {
	R *mux.Router
}

func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Accept-Language, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}

	if req.Method == "OPTIONS" {
		return
	}

	c.R.ServeHTTP(rw, req)
}
