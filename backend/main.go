package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
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
	fmt.Println("GetUsers")
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

func CreateUser(w http.ResponseWriter, rq *http.Request) {
	fmt.Println("CreateUser")
	w.Header().Set("Content-Type", "application/json")

	var user User
	_ = json.NewDecoder(rq.Body).Decode(&user)

	result, err := db.Exec("INSERT INTO users (first_name, middle_name, last_name, email, gender, civil_status, birthday, contact, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", user.FirstName, user.MiddleName, user.LastName, user.Email, user.Gender, user.CivilStatus, user.Birthday, user.Contact, user.Address)
	if err != nil {
		fmt.Println(err)
		http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	id, err := result.LastInsertId()
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	user.ID = int(id)
	json.NewEncoder(w).Encode(user)
}

func GetUser(w http.ResponseWriter, rq *http.Request) {
	fmt.Println("GetUser")
	w.Header().Set("Content-Type", "application/json")

	params := mux.Vars(rq)
	id := params["id"]

	row := db.QueryRow("SELECT * FROM users WHERE id = ?", id)

	var user User
	err := row.Scan(&user.ID, &user.FirstName, &user.MiddleName, &user.LastName, &user.Email, &user.Gender, &user.CivilStatus, &user.Birthday, &user.Contact, &user.Address)
	if err != nil {
		log.Println(err)
		if err == sql.ErrNoRows {
			http.Error(w, "User Not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func UpdateUser(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("UpdateUser")
	wr.Header().Set("Content-Type", "application/json")

	params := mux.Vars(req)
	id := params["id"]

	body, err := io.ReadAll(req.Body)
	if err != nil {
		fmt.Println("ReadAll", err)
		http.Error(wr, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	var mp map[string]string
	err = json.Unmarshal(body, &mp)
	if err != nil {
		fmt.Println("json unmarshalling", err)
		http.Error(wr, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	if len(mp) == 0 {
		http.Error(wr, `{"error": "Atleast one field is required to update"}`, http.StatusBadRequest)
		return
	}
	query := "UPDATE users SET "
	for k, v := range mp {
		query += k + " = '" + v + "', "
	}
	query = query[:len(query)-2]
	query += " WHERE id = " + id
	_, err = db.Exec(query)
	if err != nil {
		fmt.Println("Exec Query", err)
		http.Error(wr, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	// send the updated user entry response
	row := db.QueryRow("SELECT * FROM users WHERE id = ?", id)
	var user User
	err = row.Scan(&user.ID, &user.FirstName, &user.MiddleName, &user.LastName, &user.Email, &user.Gender, &user.CivilStatus, &user.Birthday, &user.Contact, &user.Address)
	if err != nil {
		log.Println("row Scan-: ", err)
		http.Error(wr, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	json.NewEncoder(wr).Encode(user)
}

func DeleteUser(wr http.ResponseWriter, req *http.Request) {
	fmt.Println("DeleteUser")
	wr.Header().Set("Content-Type", "application/json")

	params := mux.Vars(req)
	id := params["id"]

	var user User
	err := db.QueryRow("SELECT * FROM users WHERE id = ?", id).Scan(&user.ID, &user.FirstName, &user.MiddleName, &user.LastName, &user.Email, &user.Gender, &user.CivilStatus, &user.Birthday, &user.Contact, &user.Address)
	if err != nil {
		log.Println(err)
		http.Error(wr, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	_, err = db.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil {
		log.Println(err)
		http.Error(wr, `{"error": "`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	resp := map[string]interface{}{
		"message":      "User deleted successfully",
		"deleted_user": user,
	}
	jResp, _ := json.Marshal(resp)
	wr.Write(jResp)
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
