package ru.neexol.debtable.routes.account

import io.ktor.routing.*
import io.ktor.util.*

@KtorExperimentalAPI
fun Route.accountRoute() {
    route("/account") {
        changeRoute()
    }
}
