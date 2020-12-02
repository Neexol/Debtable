package ru.neexol.debtable.routes

import io.ktor.auth.*
import io.ktor.routing.*
import io.ktor.util.*

@KtorExperimentalAPI
fun Route.api() {
    route("/api") {
        auth()
        authenticate("jwt") {
            account()
            users()
        }
    }
}