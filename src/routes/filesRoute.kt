package ru.neexol.debtable.routes

import io.ktor.http.content.*
import io.ktor.routing.*

fun Routing.filesRoute() {
    static {
        resources("front")
    }
}