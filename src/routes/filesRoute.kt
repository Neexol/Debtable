package ru.neexol.debtable.routes

import io.ktor.http.content.*
import io.ktor.routing.*

fun Route.filesRoute() {
    static {
        resources("front")
        resource("/", "front/home/home.html")
        resource("/home", "front/home/home.html")
        resource("/register", "front/auth/register.html")
        resource("/login", "front/auth/login.html")
        resource("/room", "front/room/room.html")
    }
}