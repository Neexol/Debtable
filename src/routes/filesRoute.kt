package ru.neexol.debtable.routes

import io.ktor.http.content.*
import io.ktor.routing.*

fun Route.filesRoute() {
    static {
        resources("front")
    }
}