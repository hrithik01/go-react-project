package main

import (
	"database/sql"
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

func GetUsers(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("GetUsers")
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
	db, err = sql.Open("mysql", "root:root@tcp(app-mysql:3306)/app")
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
