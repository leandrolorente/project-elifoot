import mysql from "mysql"

export const db = mysql.createConnection({
    host: "rhdev.elifoot.com",
    user: "rhdev687435",
    password: "$2610$24B",
    database: "rh_dev"
})